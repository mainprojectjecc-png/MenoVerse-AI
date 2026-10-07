import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import api from "../api/axios"

function formatMessageTime(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

function initials(name) {
  return String(name || "MenoVerse member")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
}

const accentClasses = {
  rose: {
    icon: "bg-[#fceaf1] text-[#bb4f7d]",
    tag: "bg-[#fceaf1] text-[#a5446b]",
    button: "bg-[#a5446b] hover:bg-[#8e385b]",
  },
  plum: {
    icon: "bg-primary/10 text-primary",
    tag: "bg-primary/10 text-primary",
    button: "bg-primary hover:bg-plum-deep",
  },
  sage: {
    icon: "bg-[#e2f1ed] text-[#287967]",
    tag: "bg-[#e2f1ed] text-[#287967]",
    button: "bg-[#287967] hover:bg-[#206657]",
  },
  gold: {
    icon: "bg-[#fff1d8] text-[#96621c]",
    tag: "bg-[#fff1d8] text-[#96621c]",
    button: "bg-[#96621c] hover:bg-[#795017]",
  },
}

function Community() {
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null")
    } catch {
      return null
    }
  }, [])
  const [groups, setGroups] = useState([])
  const [selectedGroupId, setSelectedGroupId] = useState(null)
  const selectedGroupIdRef = useRef(null)
  const [messages, setMessages] = useState([])
  const [messagesGroupId, setMessagesGroupId] = useState(null)
  const [draft, setDraft] = useState("")
  const [loadingGroups, setLoadingGroups] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [busyGroupId, setBusyGroupId] = useState(null)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")
  const [messageError, setMessageError] = useState("")
  const [filter, setFilter] = useState("all")
  const selectedGroup = groups.find((group) => group.groupId === selectedGroupId) || null
  const visibleGroups = filter === "joined"
    ? groups.filter((group) => group.isMember)
    : groups

  const loadGroups = useCallback(async () => {
    try {
      const response = await api.get("/community/groups")
      const nextGroups = response.data
      setGroups(nextGroups)
      const nextGroup = nextGroups.find((group) => group.groupId === selectedGroupIdRef.current)
        ?? nextGroups.find((group) => group.isMember)
        ?? nextGroups[0]
        ?? null
      if (nextGroup?.isMember) setLoadingMessages(true)
      selectedGroupIdRef.current = nextGroup?.groupId ?? null
      setSelectedGroupId(nextGroup?.groupId ?? null)
      setError("")
    } catch (requestError) {
      console.error("Failed to load community groups:", requestError)
      setError(
        requestError.response?.data?.detail
          || "We couldn't load the community circles. Please try again.",
      )
    } finally {
      setLoadingGroups(false)
    }
  }, [])

  useEffect(() => {
    void Promise.resolve().then(loadGroups)
  }, [loadGroups])

  useEffect(() => {
    let active = true
    let requestInFlight = false

    async function loadMessages() {
      if (!selectedGroup?.isMember || requestInFlight) return
      requestInFlight = true
      try {
        const response = await api.get(
          `/community/groups/${selectedGroup.groupId}/messages`,
        )
        if (active) {
          setMessages(response.data)
          setMessagesGroupId(selectedGroup.groupId)
          setMessageError("")
        }
      } catch (requestError) {
        if (active) {
          console.error("Failed to load community messages:", requestError)
          setMessageError(
            requestError.response?.data?.detail
              || "We couldn't load this circle's conversation. Please try again.",
          )
        }
      } finally {
        requestInFlight = false
        if (active) setLoadingMessages(false)
      }
    }

    void loadMessages()
    const refreshTimer = window.setInterval(() => void loadMessages(), 15_000)
    return () => {
      active = false
      window.clearInterval(refreshTimer)
    }
  }, [selectedGroup?.groupId, selectedGroup?.isMember])

  const handleMembership = async (group) => {
    setBusyGroupId(group.groupId)
    setError("")
    try {
      if (group.isMember) {
        await api.delete(`/community/groups/${group.groupId}/join`)
        if (selectedGroupId === group.groupId) {
          setMessages([])
          setMessagesGroupId(null)
        }
        setGroups((current) => current.map((item) => (
          item.groupId === group.groupId
            ? { ...item, isMember: false, memberCount: Math.max(0, item.memberCount - 1) }
            : item
        )))
      } else {
        await api.post(`/community/groups/${group.groupId}/join`)
        setGroups((current) => current.map((item) => (
          item.groupId === group.groupId
            ? { ...item, isMember: true, memberCount: item.memberCount + 1 }
            : item
        )))
        selectGroup(group.groupId)
        setFilter("all")
      }
    } catch (requestError) {
      console.error("Failed to update community membership:", requestError)
      setError(
        requestError.response?.data?.detail
          || "Your group membership couldn't be updated. Please try again.",
      )
    } finally {
      setBusyGroupId(null)
    }
  }

  const handleSendMessage = async (event) => {
    event.preventDefault()
    if (!selectedGroup?.isMember || !draft.trim() || sending) return

    setSending(true)
    setMessageError("")
    try {
      const response = await api.post(
        `/community/groups/${selectedGroup.groupId}/messages`,
        { content: draft.trim() },
      )
      setMessages((current) => [...current, response.data])
      setDraft("")
    } catch (requestError) {
      console.error("Failed to send community message:", requestError)
      setMessageError(
        requestError.response?.data?.detail
          || "Your message couldn't be sent. Please try again.",
      )
    } finally {
      setSending(false)
    }
  }

  const handleRetryMessages = async () => {
    if (!selectedGroup?.isMember) return
    setLoadingMessages(true)
    setMessageError("")
    try {
      const response = await api.get(
        `/community/groups/${selectedGroup.groupId}/messages`,
      )
      setMessages(response.data)
      setMessagesGroupId(selectedGroup.groupId)
    } catch (requestError) {
      console.error("Failed to reload community messages:", requestError)
      setMessageError(
        requestError.response?.data?.detail
          || "We couldn't load this circle's conversation. Please try again.",
      )
    } finally {
      setLoadingMessages(false)
    }
  }

  const joinedCount = groups.filter((group) => group.isMember).length
  const name = user?.Name?.trim().split(/\s+/)[0] || "friend"

  const selectGroup = (groupId) => {
    setMessages([])
    setMessagesGroupId(null)
    setLoadingMessages(true)
    selectedGroupIdRef.current = groupId
    setSelectedGroupId(groupId)
  }

  return (
    <div className="min-h-screen bg-background pb-24 text-on-surface lg:pb-10">
      <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 xl:px-10">
        <section className="relative mb-7 min-h-[270px] overflow-hidden rounded-[2rem] bg-[#432748] shadow-[0_24px_65px_-34px_rgba(55,28,69,0.6)] sm:min-h-[320px]">
          <img
            src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1800&q=85"
            alt="Two women sharing a supportive conversation"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#35213c]/95 via-[#432748]/75 to-[#432748]/10" />
          <div className="relative z-10 flex min-h-[270px] items-center px-6 py-8 sm:min-h-[320px] sm:px-10 lg:px-14">
            <div className="max-w-xl text-white">
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white/90 backdrop-blur-sm">
                <span className="material-symbols-outlined text-[16px]">diversity_3</span>
                Better, together
              </p>
              <h1 className="font-headline-xl text-3xl font-semibold leading-tight sm:text-5xl">
                There&apos;s a circle for every chapter.
              </h1>
              <p className="mt-3 max-w-md text-sm leading-6 text-white/80 sm:text-base">
                Find your people, share the little things, and feel supported by women who understand midlife.
              </p>
              <a
                href="#support-circles"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-primary shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Find your circle
                <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
              </a>
            </div>
          </div>
          <span className="absolute bottom-5 right-6 z-10 rounded-full border border-white/20 bg-black/20 px-3 py-1.5 text-[10px] text-white/75 backdrop-blur-sm sm:bottom-6 sm:right-8">
            A welcoming space for women navigating midlife
          </span>
        </section>

        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-tertiary">Your people, your pace</p>
            <h2 className="mt-1 font-headline-lg text-2xl font-semibold text-primary sm:text-3xl">
              Welcome in, {name}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-on-surface-variant">
              Join a group that feels right for you. Your membership and conversations are shared with members of that group.
            </p>
          </div>
          <div className="rounded-2xl border border-outline-variant/60 bg-white px-4 py-3 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Your circles</p>
            <p className="mt-1 flex items-center gap-2 text-xl font-semibold text-primary">
              <span className="material-symbols-outlined text-[20px] text-tertiary">favorite</span>
              {joinedCount} joined
            </p>
          </div>
        </div>

        {error && (
          <div role="alert" className="mb-5 flex items-start justify-between gap-3 rounded-2xl border border-risk-high/20 bg-white px-4 py-3 text-sm text-risk-high shadow-sm">
            <span>{error}</span>
            <button type="button" onClick={() => void loadGroups()} className="shrink-0 font-semibold underline underline-offset-2">
              Retry
            </button>
          </div>
        )}

        <section id="support-circles" className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
          <div>
            <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-on-surface-variant">Meet women who get it</p>
                <h2 className="mt-1 font-headline-md text-xl font-semibold text-on-surface sm:text-2xl">Support circles</h2>
              </div>
              <div className="inline-flex rounded-xl border border-outline-variant/60 bg-white p-1">
                {[
                  { id: "all", label: "Discover" },
                  { id: "joined", label: `Joined (${joinedCount})` },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFilter(tab.id)}
                    aria-pressed={filter === tab.id}
                    className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      filter === tab.id
                        ? "bg-primary text-white shadow-sm"
                        : "text-on-surface-variant hover:text-primary"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {loadingGroups ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {[1, 2, 3, 4].map((item) => <div key={item} className="h-52 animate-pulse rounded-3xl bg-white/80" />)}
              </div>
            ) : visibleGroups.length ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {visibleGroups.map((group) => {
                  const accent = accentClasses[group.accent] || accentClasses.plum
                  const selected = selectedGroup?.groupId === group.groupId
                  const busy = busyGroupId === group.groupId
                  return (
                    <article
                      key={group.groupId}
                      className={`rounded-3xl border bg-white p-5 shadow-[0_16px_42px_-32px_rgba(43,21,56,0.48)] transition-all ${
                        selected
                          ? "border-primary/40 ring-2 ring-primary/10"
                          : "border-outline-variant/55 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          if (group.groupId !== selectedGroupId) {
                            selectGroup(group.groupId)
                          }
                        }}
                        aria-pressed={selected}
                        className="w-full text-left"
                      >
                        <div className="mb-4 flex items-start justify-between gap-3">
                          <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accent.icon}`}>
                            <span className="material-symbols-outlined text-[24px]">{group.icon}</span>
                          </span>
                          {selected && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary">
                              <span className="material-symbols-outlined text-[14px]">forum</span>
                              Selected
                            </span>
                          )}
                        </div>
                        <h3 className="font-headline-md text-lg font-semibold text-on-surface">{group.name}</h3>
                        <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${accent.tag}`}>
                          {group.focus}
                        </span>
                        <p className="mt-3 min-h-[60px] text-xs leading-5 text-on-surface-variant">{group.description}</p>
                      </button>
                      <div className="mt-4 flex items-center justify-between gap-3 border-t border-outline-variant/45 pt-4">
                        <span className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant">
                          <span className="material-symbols-outlined text-[17px]">group</span>
                          {group.memberCount} {group.memberCount === 1 ? "member" : "members"}
                        </span>
                        <button
                          type="button"
                          onClick={() => void handleMembership(group)}
                          disabled={busy}
                          className={`inline-flex min-w-[104px] items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-white transition disabled:cursor-wait disabled:opacity-60 ${
                            group.isMember
                              ? "bg-secondary hover:bg-[#0b5757]"
                              : accent.button
                          }`}
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            {busy ? "progress_activity" : group.isMember ? "check" : "add"}
                          </span>
                          {busy ? "Saving…" : group.isMember ? "Leave circle" : "Join circle"}
                        </button>
                      </div>
                    </article>
                  )
                })}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-outline-variant bg-white/70 px-6 py-10 text-center">
                <span className="material-symbols-outlined text-3xl text-primary/60">diversity_3</span>
                <h3 className="mt-3 font-headline-md text-lg font-semibold text-primary">Your circle is waiting</h3>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-on-surface-variant">
                  You haven&apos;t joined a group yet. Choose Discover to find a welcoming circle.
                </p>
                <button type="button" onClick={() => setFilter("all")} className="mt-4 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white">
                  Explore circles
                </button>
              </div>
            )}

            <p className="mt-4 flex items-start gap-2 rounded-2xl bg-white/60 px-4 py-3 text-[11px] leading-5 text-on-surface-variant">
              <span className="material-symbols-outlined mt-0.5 text-[16px] text-secondary">shield</span>
              Keep it kind and protect your privacy. Group conversations are visible to members; avoid sharing details you would not want the group to know.
            </p>
          </div>

          <section className="overflow-hidden rounded-3xl border border-outline-variant/55 bg-white shadow-[0_18px_45px_-32px_rgba(43,21,56,0.42)]">
            <div className="flex items-center justify-between gap-3 border-b border-outline-variant/50 bg-gradient-to-r from-[#f7eaf1] to-[#f3edf6] px-5 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/75 text-primary shadow-sm">
                  <span className="material-symbols-outlined">forum</span>
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-tertiary">Keep in touch</p>
                  <h2 className="truncate font-headline-md text-lg font-semibold text-primary">
                    {selectedGroup?.name || "Circle conversation"}
                  </h2>
                </div>
              </div>
              {selectedGroup?.isMember && (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-secondary/10 px-2.5 py-1 text-[10px] font-semibold text-secondary">
                  <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                  Live updates
                </span>
              )}
            </div>

            {selectedGroup?.isMember ? (
              <>
                <div className="flex h-[360px] flex-col gap-4 overflow-y-auto bg-[#fcfafc] px-4 py-5 sm:px-5">
                  {loadingMessages ? (
                    <div className="flex flex-1 items-center justify-center text-sm text-on-surface-variant">
                      <span className="material-symbols-outlined mr-2 animate-spin text-[19px]">progress_activity</span>
                      Opening your circle…
                    </div>
                  ) : messagesGroupId !== selectedGroup.groupId && messageError ? (
                    <div className="m-auto max-w-sm text-center">
                      <span className="material-symbols-outlined text-3xl text-risk-high">cloud_off</span>
                      <p role="alert" className="mt-2 text-sm text-risk-high">{messageError}</p>
                      <button type="button" onClick={() => void handleRetryMessages()} className="mt-3 rounded-lg px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/5">
                        Try again
                      </button>
                    </div>
                  ) : messagesGroupId === selectedGroup.groupId && messages.length ? (
                    messages.filter((message) => message.groupId === selectedGroup.groupId).map((message) => (
                      <article
                        key={message.messageId}
                        className={`flex items-end gap-2.5 ${message.isMine ? "flex-row-reverse" : ""}`}
                      >
                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                          message.isMine ? "bg-primary text-white" : "bg-secondary-container text-on-secondary-container"
                        }`}>
                          {initials(message.author)}
                        </span>
                        <div className={`max-w-[82%] ${message.isMine ? "text-right" : ""}`}>
                          <div className={`mb-1 flex items-baseline gap-2 text-[10px] text-on-surface-variant ${message.isMine ? "justify-end" : ""}`}>
                            <span className="font-semibold">{message.isMine ? "You" : message.author}</span>
                            <time dateTime={message.createdAt}>{formatMessageTime(message.createdAt)}</time>
                          </div>
                          <p className={`whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2.5 text-left text-sm leading-5 ${
                            message.isMine
                              ? "rounded-br-sm bg-primary text-white"
                              : "rounded-bl-sm border border-outline-variant/45 bg-white text-on-surface"
                          }`}>
                            {message.content}
                          </p>
                        </div>
                      </article>
                    ))
                  ) : (
                    <div className="m-auto max-w-sm text-center">
                      <span className="material-symbols-outlined text-4xl text-tertiary/70">waving_hand</span>
                      <h3 className="mt-3 font-headline-md text-lg font-semibold text-primary">Start the conversation</h3>
                      <p className="mt-1 text-xs leading-5 text-on-surface-variant">
                        Share a thought, ask a question, or simply say hello to your circle.
                      </p>
                      <div className="mt-4 flex flex-wrap justify-center gap-2">
                        {["Hi, I'm glad to be here.", "What's one small win from your week?"].map((prompt) => (
                          <button
                            key={prompt}
                            type="button"
                            onClick={() => setDraft(prompt)}
                            className="rounded-full border border-primary/15 bg-white px-3 py-2 text-[10px] font-medium text-primary transition hover:bg-primary/5"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSendMessage} className="border-t border-outline-variant/50 bg-white p-4">
                  {messageError && !loadingMessages && messagesGroupId === selectedGroup.groupId && (
                    <p role="alert" className="mb-2 text-xs text-risk-high">{messageError}</p>
                  )}
                  <label className="sr-only" htmlFor="community-message">Write a message to {selectedGroup.name}</label>
                  <div className="flex items-end gap-2">
                    <textarea
                      id="community-message"
                      value={draft}
                      onChange={(event) => setDraft(event.target.value.slice(0, 1000))}
                      maxLength={1000}
                      rows={2}
                      placeholder="Write a kind note…"
                      className="min-h-[48px] flex-1 resize-y rounded-xl border border-outline-variant/70 bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />
                    <button
                      type="submit"
                      disabled={!draft.trim() || sending || loadingMessages}
                      aria-label="Send message"
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white transition hover:bg-plum-deep disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      <span className={`material-symbols-outlined text-[20px] ${sending ? "animate-pulse" : ""}`}>
                        {sending ? "progress_activity" : "send"}
                      </span>
                    </button>
                  </div>
                  <div className="mt-2 flex justify-between text-[10px] text-on-surface-variant">
                    <span>Messages are shared with everyone in this circle.</span>
                    <span>{draft.length}/1000</span>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex min-h-[430px] flex-col items-center justify-center px-6 py-10 text-center">
                <div className="relative mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-[#f7eaf1]">
                  <span className="material-symbols-outlined text-5xl text-tertiary">diversity_3</span>
                  <span className="absolute -right-1 bottom-1 flex h-9 w-9 items-center justify-center rounded-full border-4 border-white bg-secondary text-white">
                    <span className="material-symbols-outlined text-[17px]">favorite</span>
                  </span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-tertiary">A little more connected</p>
                <h3 className="mt-2 max-w-sm font-headline-md text-xl font-semibold text-primary">
                  {selectedGroup ? `Join ${selectedGroup.name}` : "Choose a circle to get started"}
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-on-surface-variant">
                  Once you join, you can share messages and keep in touch with the women in your circle.
                </p>
                {selectedGroup && (
                  <button
                    type="button"
                    onClick={() => void handleMembership(selectedGroup)}
                    disabled={busyGroupId === selectedGroup.groupId}
                    className={`mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition disabled:opacity-60 ${
                      (accentClasses[selectedGroup.accent] || accentClasses.plum).button
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">group_add</span>
                    {busyGroupId === selectedGroup.groupId ? "Joining…" : "Join this circle"}
                  </button>
                )}
              </div>
            )}
          </section>
        </section>
      </main>
    </div>
  )
}

export default Community

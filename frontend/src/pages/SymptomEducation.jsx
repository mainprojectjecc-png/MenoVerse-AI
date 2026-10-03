import { Link, Navigate, useParams } from "react-router-dom";
import hotFlashImage from "../../reference/ho.png";
import sleepImage from "../../reference/sleep.png";
import moodImage from "../../reference/mood.png";
import irregularImage from "../../reference/irregular.png";

const sources = [
  {
    label: "NHS: Symptoms of menopause and perimenopause",
    href: "https://www.nhs.uk/conditions/menopause-and-perimenopause/symptoms/",
  },
  {
    label: "Mayo Clinic: Perimenopause",
    href: "https://www.mayoclinic.org/diseases-conditions/perimenopause/symptoms-causes/syc-20354666",
  },
];

const guides = {
  "hot-flashes": {
    title: "Hot Flashes",
    icon: "thermostat",
    summary: "A hot flash is a sudden wave of heat that can feel intense, even when the room is comfortable.",
    whatItFeelsLike: "Heat may spread across the face, neck, and chest. Some people also sweat, feel their heart beat faster, or feel dizzy or anxious. Episodes can happen during the day or at night; night-time episodes are often called night sweats.",
    whyItCanHappen: "During perimenopause, hormone levels fluctuate as the body moves toward menopause. Hot flashes are a common symptom of this transition, but feeling hot can have other causes too, so a new or worrying symptom should not automatically be assumed to be menopause.",
    whatMayHelp: "Notice when episodes happen and whether anything seems to trigger them. Keeping the room cool, wearing light layers, and discussing disruptive symptoms with a healthcare professional are practical starting points.",
    whenToGetHelp: "Talk with a healthcare professional if hot flashes are disrupting sleep or daily life, or if you are unsure what is causing them.",
  },
  "sleep-issues": {
    title: "Sleep Issues",
    icon: "bedtime",
    summary: "Perimenopause can affect sleep, making it harder to fall asleep, stay asleep, or feel rested.",
    whatItFeelsLike: "You might wake during the night, wake earlier than you want, or feel tired and less focused the next day. Night sweats can interrupt sleep, but sleep changes can also happen without hot flashes.",
    whyItCanHappen: "Changing hormones can be part of the transition. Night sweats may wake you, and poor sleep can then add to irritability, stress, or low energy. Sleep problems also have many other possible causes, so they are not proof of perimenopause on their own.",
    whatMayHelp: "Keep a simple note of sleep and night-time symptoms to look for patterns. If the problem continues or affects your day-to-day life, a healthcare professional can help consider possible causes and options.",
    whenToGetHelp: "Seek advice if sleep problems are persistent, significantly affect your wellbeing, or come with other symptoms that concern you.",
  },
  "mood-shifts": {
    title: "Mood Shifts",
    icon: "mood",
    summary: "Some people notice mood swings, irritability, anxiety, or low mood during perimenopause.",
    whatItFeelsLike: "You may feel more easily upset or tense, or notice your mood changing in ways that feel unfamiliar. Poor sleep and tiredness can make these feelings harder to manage. Experiences vary, and not everyone has mood symptoms.",
    whyItCanHappen: "Hormone changes and disrupted sleep may play a part during the menopausal transition. Mood changes can also come from life stress, existing mental-health conditions, or other health factors; they should not be dismissed as simply hormonal.",
    whatMayHelp: "Tracking mood alongside sleep and cycle changes can help you explain what is happening. Support from someone you trust and a conversation with a healthcare professional can help, especially if symptoms are affecting everyday life.",
    whenToGetHelp: "Talk with a healthcare professional if low mood, anxiety, or irritability persists or feels difficult to cope with. If you may harm yourself or feel unsafe, seek urgent local help now.",
  },
  "irregular-periods": {
    title: "Irregular Periods",
    icon: "calendar_month",
    summary: "As perimenopause begins, periods may come closer together or farther apart, and their flow may change.",
    whatItFeelsLike: "A cycle may be shorter or longer than you are used to; bleeding may be lighter or heavier, and a period may occasionally be skipped. This can happen because ovulation becomes less predictable during the transition.",
    whyItCanHappen: "Changing hormone levels affect the menstrual cycle. Irregular periods are common in perimenopause, but changes in bleeding can also have other causes. Perimenopause does not mean pregnancy is impossible if periods are still happening.",
    whatMayHelp: "Record period dates, how long bleeding lasts, and whether it is lighter or heavier than usual. Sharing that record with a clinician can make it easier to describe the change.",
    whenToGetHelp: "Contact a healthcare professional for very heavy bleeding, bleeding lasting more than seven days, bleeding between periods, or periods less than 21 days apart. Any bleeding after 12 months without a period should be checked promptly.",
  },
};

export default function SymptomEducation() {
  const { slug } = useParams();
  const guide = guides[slug];

  if (!guide) return <Navigate to="/education" replace />;

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#1e1c10]">
      <main className="mx-auto max-w-[1100px] px-6 py-10 pb-32 md:px-16">
        <Link
          to="/education"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#535845] hover:text-[#744c36]"
        >
          <span className="material-symbols-outlined text-xl">arrow_back</span>
          Back to Education
        </Link>

        <header className="mb-8 border-b border-[#d1cec0] pb-8">
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.08em] text-[#6b705c]">
            <span className="material-symbols-outlined text-[#84A59D]">{guide.icon}</span>
            Perimenopause symptom guide
          </p>
          <h1 className="text-3xl leading-tight text-[#3F3D35] sm:text-4xl" style={{ fontFamily: "Playfair Display" }}>
            {guide.title} during perimenopause
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-[#535845]">
            {guide.summary}
          </p>
        </header>

        {slug === "hot-flashes" && (
          <figure className="mb-8 max-w-[560px] overflow-hidden rounded-lg border border-[#d1cec0] bg-[#fffdf8] shadow-sm">
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src={hotFlashImage}
                alt="A woman feeling overheated and using a fan for relief during a hot flash."
                className="h-full w-full object-cover object-[38%_center]"
              />
            </div>
            <figcaption className="px-4 py-3 text-sm text-[#6B695E]">
              A hot flash can bring a sudden wave of heat and sweating.
            </figcaption>
          </figure>
        )}

        {slug === "sleep-issues" && (
          <figure className="mb-8 max-w-[640px] overflow-hidden rounded-lg border border-[#d1cec0] bg-[#fffdf8] shadow-sm">
            <div className="aspect-[2/1] overflow-hidden">
              <img
                src={sleepImage}
                alt="Four scenes showing difficulty falling asleep, waking with night sweats, waking too early, and feeling tired the next day."
                className="h-full w-full object-cover"
              />
            </div>
            <figcaption className="px-4 py-3 text-sm text-[#6B695E]">
              Sleep changes can include trouble falling asleep, night waking, early waking, and daytime tiredness.
            </figcaption>
          </figure>
        )}

        {slug === "mood-shifts" && (
          <figure className="mb-8 max-w-[640px] overflow-hidden rounded-lg border border-[#d1cec0] bg-[#fffdf8] shadow-sm">
            <div className="aspect-[2/1] overflow-hidden">
              <img
                src={moodImage}
                alt="Four scenes illustrating unfamiliar mood changes, irritability, anxious feelings, and persistent low mood."
                className="h-full w-full object-cover"
              />
            </div>
            <figcaption className="px-4 py-3 text-sm text-[#6B695E]">
              Mood changes can vary, from irritability or anxiety to low mood.
            </figcaption>
          </figure>
        )}

        {slug === "irregular-periods" && (
          <figure className="mb-8 max-w-[640px] overflow-hidden rounded-lg border border-[#d1cec0] bg-[#fffdf8] shadow-sm">
            <div className="aspect-[2/1] overflow-hidden">
              <img
                src={irregularImage}
                alt="Four scenes showing unpredictable cycles, missed periods, variable flow, and recording period dates."
                className="h-full w-full object-cover"
              />
            </div>
            <figcaption className="px-4 py-3 text-sm text-[#6B695E]">
              Tracking cycle dates and flow can help you notice changes and discuss them with a clinician.
            </figcaption>
          </figure>
        )}

        <div className="space-y-6">
          <section className="rounded-lg border border-[#d1cec0] bg-[#fffdf8] p-6 shadow-sm">
            <h2 className="text-xl text-[#3F3D35]" style={{ fontFamily: "Playfair Display" }}>
              What might it feel like?
            </h2>
            <p className="mt-3 leading-relaxed text-[#6B695E]">{guide.whatItFeelsLike}</p>
          </section>

          <section className="rounded-lg border-l-4 border-[#84A59D] bg-[#faf4df] p-6 shadow-sm">
            <h2 className="text-xl text-[#3F3D35]" style={{ fontFamily: "Playfair Display" }}>
              Why can it happen during perimenopause?
            </h2>
            <p className="mt-3 leading-relaxed text-[#6B695E]">{guide.whyItCanHappen}</p>
          </section>

          <section className="rounded-lg border border-[#d1cec0] bg-[#fffdf8] p-6 shadow-sm">
            <h2 className="text-xl text-[#3F3D35]" style={{ fontFamily: "Playfair Display" }}>
              What may help?
            </h2>
            <p className="mt-3 leading-relaxed text-[#6B695E]">{guide.whatMayHelp}</p>
          </section>

          <section className="rounded-lg bg-[#e2e1c7] p-6">
            <h2 className="text-xl text-[#535845]" style={{ fontFamily: "Playfair Display" }}>
              When to get medical advice
            </h2>
            <p className="mt-3 leading-relaxed text-[#535845]">{guide.whenToGetHelp}</p>
          </section>
        </div>

        <section className="mt-10 border-t border-[#d1cec0] pt-6" aria-labelledby="sources-title">
          <h2 id="sources-title" className="text-sm font-semibold text-[#3F3D35]">
            Trusted sources
          </h2>
          <ul className="mt-3 space-y-2">
            {sources.map((source) => (
              <li key={source.href}>
                <a
                  href={source.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-[#535845] underline decoration-[#a8a596] underline-offset-4 hover:text-[#744c36]"
                >
                  {source.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-[#6B695E]">
            This guide is for general information, not a diagnosis. Symptoms can have causes other than perimenopause; a healthcare professional can help you understand what is right for you.
          </p>
        </section>
      </main>
    </div>
  );
}
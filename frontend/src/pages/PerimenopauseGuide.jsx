import { useEffect } from "react";
import { Link } from "react-router-dom";
import womanSittingImage from "../../reference/womansitting.png";

const heroImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCYDNISm_KLOYUXnA0wZgbq7Evagm9q_t-y1FreFulcCPDYHRBgW0WsuYX3KqTFYc3HhssQsIGLp5P6rQtO-CjDpMuNEOyW9e-8xf8cHCJqLdzukcy2PmCoGUBwAU8lft64CXcqrRapVkv9whRlqWjVEZiedKGGD8rcqmPs1xy_5GHakfrqE5PpYADyN_DussC0BRfN5zll1sTWoQFBmjw46J-__4kWfX1MSxXeCf_hGUg5bd2DWruWcQ";

const symptomCards = [
  { slug: "hot-flashes", icon: "thermostat", title: "Hot Flashes", description: "Sudden waves of heat", tone: "text-[#BC6C4D]" },
  { slug: "sleep-issues", icon: "bedtime", title: "Sleep Issues", description: "Insomnia or night sweats", tone: "text-[#535845]" },
  { slug: "mood-shifts", icon: "mood", title: "Mood Shifts", description: "Irritability or anxiety", tone: "text-[#84A59D]" },
  { slug: "irregular-periods", icon: "calendar_month", title: "Irregularity", description: "Cycle length variations", tone: "text-[#744c36]" },
];

const supportSteps = [
  {
    icon: "restaurant",
    title: "Nutritional Support",
    text: "Focus on magnesium-rich foods and complex carbohydrates to stabilize insulin and mood.",
  },
  {
    icon: "self_improvement",
    title: "Stress Resilience",
    text: "Mindfulness and breathwork help manage cortisol spikes that trigger symptoms.",
  },
  {
    icon: "monitoring",
    title: "Tracking is Power",
    text: "Logging symptoms helps identify patterns and empowers you during clinical visits.",
  },
];

export default function PerimenopauseGuide() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll(".fade-in-section");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#1e1c10]">
      <main className="mx-auto max-w-[1100px] px-6 py-10 pb-32 md:px-16">
        <section className="relative mb-8 h-72 w-full overflow-hidden sm:h-80 lg:h-[22rem]">
          <div className="absolute inset-0 z-0">
            <img
              src={heroImage}
              alt="Tranquil botanical shapes in warm cream and sage tones"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F0] via-[#FAF7F0]/40 to-transparent" />
          </div>

          <div className="relative z-10 flex h-full items-end pb-6">
            <div>
              <span className="mb-3 inline-block rounded-lg bg-[#6b705c] px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#eff4db]">
                Educational Guide
              </span>
              <h2 className="text-[40px] leading-tight text-[#3F3D35]" style={{ fontFamily: "Playfair Display", letterSpacing: "-0.01em" }}>
                Understanding<br />Perimenopause
              </h2>
            </div>
          </div>
        </section>

        <div className="space-y-12">
          <article className="fade-in-section space-y-4">
            <div className="flex items-center gap-3 text-[#535845]">
              <span className="material-symbols-outlined text-[#84A59D]" style={{ fontVariationSettings: "'FILL' 1" }}>
                info
              </span>
              <h3 className="text-[24px] text-[#3F3D35]" style={{ fontFamily: "Playfair Display" }}>
                What is Perimenopause?
              </h3>
            </div>

            <div className="rounded-lg border-l-4 border-[#84A59D] bg-[#faf4df] p-6 shadow-sm">
              <p className="text-[16px] leading-relaxed text-[#6B695E]">
                Perimenopause means "around menopause" and refers to the time during which your body makes the natural transition to menopause, marking the end of the reproductive years. It is a unique journey for every woman, often beginning in her 40s.
              </p>
            </div>
          </article>

          <div className="fade-in-section overflow-hidden rounded-lg border border-[#d1cec0]/30 shadow-sm">
            <img
              src={womanSittingImage}
              alt="A serene woman in her 40s sitting peacefully in a sunlit room"
              className="h-auto w-full object-cover"
            />
          </div>

          <article className="fade-in-section space-y-6">
            <div className="flex items-center gap-3 text-[#535845]">
              <span className="material-symbols-outlined text-[#84A59D]" style={{ fontVariationSettings: "'FILL' 1" }}>
                analytics
              </span>
              <h3 className="text-[24px] text-[#3F3D35]" style={{ fontFamily: "Playfair Display" }}>
                Common Symptoms
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {symptomCards.map((item) => (
                <Link
                  key={item.title}
                  to={`/education/symptoms/${item.slug}`}
                  aria-label={`Learn about ${item.title} during perimenopause`}
                  className="flex cursor-pointer flex-col items-center rounded-lg border border-[#d1cec0] bg-[#fffdf8] p-5 text-center shadow-sm transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#535845]"
                >
                  <span className={`material-symbols-outlined mb-3 text-[2.25rem] ${item.tone}`}>
                    {item.icon}
                  </span>
                  <h4 className="text-[14px] font-semibold text-[#3F3D35]">{item.title}</h4>
                  <p className="mt-1 text-[12px] text-[#6B695E]">{item.description}</p>
                </Link>
              ))}
            </div>
          </article>

          <div className="fade-in-section overflow-hidden rounded-lg border border-[#d1cec0]/30 bg-[#e2e1c7] p-10 text-center shadow-sm">
            <h4 className="text-[24px] text-[#535845]" style={{ fontFamily: "Playfair Display" }}>
              Your Body is Evolving
            </h4>
            <p className="mt-3 px-4 text-[16px] font-medium italic text-[#63644f]">
              “These changes are a natural part of your body's wisdom, not a clinical problem to be solved.”
            </p>
          </div>

          <article className="fade-in-section space-y-6">
            <div className="flex items-center gap-3 text-[#535845]">
              <span className="material-symbols-outlined text-[#84A59D]" style={{ fontVariationSettings: "'FILL' 1" }}>
                spa
              </span>
              <h3 className="text-[24px] text-[#3F3D35]" style={{ fontFamily: "Playfair Display" }}>
                The Path to Balance
              </h3>
            </div>

            <ul className="space-y-4">
              {supportSteps.map((step) => (
                <li
                  key={step.title}
                  className="flex items-start gap-4 rounded-lg border border-[#d1cec0]/40 bg-[#fffdf8] p-5 shadow-sm"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#e0e5cc] text-[#535845]">
                    <span className="material-symbols-outlined">{step.icon}</span>
                  </div>
                  <div>
                    <h5 className="text-[14px] font-semibold text-[#3F3D35]">{step.title}</h5>
                    <p className="mt-1 text-[12px] leading-relaxed text-[#6B695E]">{step.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </article>

          <div className="fade-in-section flex flex-col items-center py-8">
            <button className="w-full rounded-lg bg-[#3F3D35] px-5 py-5 text-lg font-semibold uppercase tracking-[0.08em] text-white shadow-xl transition-transform active:scale-95 sm:w-auto sm:min-w-[280px]">
              Start Your Journey
            </button>
            <button className="mt-6 text-[14px] font-semibold text-[#535845] underline decoration-[#d1cec0] underline-offset-4 transition-colors hover:text-[#744c36]">
              Read More Articles
            </button>
          </div>
        </div>
      </main>

    </div>
  );
}

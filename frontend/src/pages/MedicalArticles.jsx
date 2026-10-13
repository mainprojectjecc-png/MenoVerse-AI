import { Link } from "react-router-dom"

const articles = [
  {
    organization: "NHS",
    title: "Menopause and perimenopause",
    category: "Overview",
    description:
      "An overview of the menopause transition, common experiences, and when to ask for help.",
    href: "https://www.nhs.uk/conditions/menopause-and-perimenopause/",
  },
  {
    organization: "NHS",
    title: "Menopause and perimenopause symptoms",
    category: "Symptoms",
    description:
      "Information about changes to periods, hot flushes, sleep, mood, and other symptoms.",
    href: "https://www.nhs.uk/conditions/menopause-and-perimenopause/symptoms/",
  },
  {
    organization: "NHS",
    title: "Treatment for menopause and perimenopause",
    category: "Treatment",
    description:
      "A review of HRT and non-hormonal options, with advice to discuss choices with a clinician.",
    href: "https://www.nhs.uk/conditions/menopause-and-perimenopause/treatment/",
  },
  {
    organization: "American College of Obstetricians and Gynecologists",
    title: "The Menopause Years",
    category: "Patient guide",
    description:
      "An OB-GYN professional organization’s patient FAQ about menopause and related care.",
    href: "https://www.acog.org/womens-health/faqs/the-menopause-years",
  },
  {
    organization: "Mayo Clinic",
    title: "Perimenopause: Symptoms and causes",
    category: "Symptoms",
    description:
      "A clinical overview of common perimenopause symptoms and what may cause them.",
    href: "https://www.mayoclinic.org/diseases-conditions/perimenopause/symptoms-causes/syc-20354666",
  },
  {
    organization: "Office on Women’s Health, U.S. Department of Health and Human Services",
    title: "Menopause",
    category: "Patient guide",
    description:
      "Federal health information about menopause, symptoms, diagnosis, and treatment.",
    href: "https://womenshealth.gov/menopause",
  },
  {
    organization: "National Institute for Health and Care Excellence",
    title: "Menopause: identification and management",
    category: "Clinical guideline",
    description:
      "Evidence-based UK clinical recommendations for identifying and managing menopause.",
    href: "https://www.nice.org.uk/guidance/ng23",
  },
  {
    organization: "The Menopause Society",
    title: "Patient education: Menopause topics",
    category: "Patient education",
    description:
      "Patient resources from a professional society focused on menopause care and research.",
    href: "https://menopause.org/patient-education",
  },
  {
    organization: "The Menopause Society",
    title: "Hot flashes",
    category: "Symptoms",
    description:
      "Evidence-informed information about hot flashes, night sweats, and treatment options.",
    href: "https://menopause.org/patient-education/menopause-topics/hot-flashes/",
  },
  {
    organization: "The Menopause Society",
    title: "Hormone therapy",
    category: "Treatment",
    description:
      "Information about hormone therapy types, benefits, risks, and individualized decisions.",
    href: "https://menopause.org/patient-education/menopause-topics/hormone-therapy/",
  },
  {
    organization: "MedlinePlus, U.S. National Library of Medicine",
    title: "Menopause",
    category: "Medical encyclopedia",
    description:
      "A medically reviewed overview of menopause, symptoms, and treatment options.",
    href: "https://medlineplus.gov/menopause.html",
  },
]

export default function MedicalArticles() {
  return (
    <main className="min-h-screen bg-[#FAF7F0] px-6 py-8 pb-32 text-[#1e1c10] md:px-12">
      <div className="mx-auto max-w-[1100px]">
        <Link
          to="/education"
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[#535845] hover:text-[#744c36]"
        >
          <span className="material-symbols-outlined text-xl" aria-hidden="true">
            arrow_back
          </span>
          Back to Education
        </Link>

        <header className="mb-8 border-b border-[#d1cec0]/70 pb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#6b705c]">
            Trusted health resources
          </p>
          <h1
            className="text-3xl leading-tight text-[#3F3D35] sm:text-4xl"
            style={{ fontFamily: "Playfair Display" }}
          >
            Medically reviewed menopause articles
          </h1>
          <p className="mt-3 max-w-3xl leading-relaxed text-[#6B695E]">
            Explore patient information and clinical guidance from established
            health services, medical organizations, and government health
            agencies. Each article opens on its publisher’s website.
          </p>
        </header>

        <p className="mb-5 text-sm font-medium text-[#535845]">
          {articles.length} trusted resources
        </p>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <li key={article.href}>
              <a
                href={article.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col rounded-xl border border-[#d1cec0]/60 bg-[#fffdf8] p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#535845]"
              >
                <span className="inline-flex w-fit rounded-full bg-[#e2e5d2] px-3 py-1 text-xs font-semibold text-[#535845]">
                  {article.category}
                </span>
                <span className="mt-4 text-xs font-semibold uppercase leading-relaxed tracking-wide text-[#6b705c]">
                  {article.organization}
                </span>
                <h2 className="mt-2 text-base font-semibold leading-snug text-[#3F3D35] group-hover:text-[#744c36]">
                  {article.title}
                  <span
                    className="material-symbols-outlined ml-1 align-middle text-base"
                    aria-hidden="true"
                  >
                    open_in_new
                  </span>
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-[#6B695E]">
                  {article.description}
                </p>
              </a>
            </li>
          ))}
        </ul>

        <aside className="mt-8 rounded-lg border-l-4 border-[#84A59D] bg-[#faf4df] p-5 text-sm leading-relaxed text-[#535845]">
          These resources are for general education and do not replace advice
          from your own healthcare professional. Treatment decisions should be
          made with a clinician who understands your health history.
        </aside>
      </div>
    </main>
  )
}

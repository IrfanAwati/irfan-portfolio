/**
 * Core identity + contact. Every value here is sourced from Irfan's public
 * LinkedIn profile or his GitHub profile README. See CONTENT-INVENTORY.md for
 * the source of each claim and the open questions.
 */

export const profile = {
  name: 'Irfan Awati',
  firstName: 'Irfan',
  lastName: 'Awati',
  role: 'DevOps → DevSecOps Engineer',
  focus: 'Azure · AWS · On-prem · Secure delivery',
  // GitHub README lists Dubai, UAE; LinkedIn lists Bengaluru, India. Confirm.
  location: 'Dubai, UAE',
  origin: 'Karnataka, India',
  currentCompany: 'Lisec Middle East Ltd. FZE',
  intro:
    '6+ years running infrastructure across Azure, AWS and on-prem servers, building the pipelines that ship to all of them, and wiring security checks into those pipelines so code is checked before it ever reaches production.',
  // Irfan's own words, from his LinkedIn post announcing his DevSecOps roadmap.
  philosophyQuote:
    'Speed alone isn’t enough. If what we deploy isn’t secure, we’re just shipping risk faster.',
  links: {
    linkedin: 'https://www.linkedin.com/in/irfan-ia/',
    github: 'https://github.com/IrfanAwati',
    // Public address from github.com/IrfanAwati README. Confirm before launch.
    email: 'imawati080@gmail.com',
    // PDFs in public/resume/ (note: both include phone numbers)
    resume: '/resume/Irfan-Awati-CV.pdf' as string,
    coverLetter: '/resume/Irfan-Awati-Cover-Letter.pdf' as string,
  },
  languages: [
    { name: 'English', level: 'Professional working' },
    { name: 'Hindi', level: 'Full professional' },
    { name: 'Urdu', level: 'Full professional' },
    { name: 'Kannada', level: 'Professional working' },
    { name: 'Marathi', level: 'Limited working' },
  ],
}

export const about = {
  kicker: 'Engineering philosophy',
  // Real photo for the About card (AI-enhanced lighting and grade from Irfan's own photo).
  photo: {
    src: '/about/irfan-about.webp',
    alt: 'Irfan Awati in a white kandura and glasses, standing outdoors with softly blurred greenery behind him',
  },
  // Illustrated cutout used in the hero (transparent background).
  portrait: {
    src: '/about/irfan-portrait.webp',
    alt: 'Illustrated portrait of Irfan Awati in a navy blazer and white shirt, with glasses and a full beard, smiling',
  },
  lede: 'I started with machines that move: automobiles, a warehouse robot, a parking system for smart cities. Now the systems I work on are cloud infrastructure and delivery pipelines.',
  paragraphs: [
    'My early engineering work was mechanical and automotive. I won a national paper presentation on smart automobiles and built an automated guided vehicle. That gave me an instinct I still use: every moving part needs a path, a limit and a way to fail safely.',
    'I took that into infrastructure work across on-prem data centres, Azure and AWS. I provision with Terraform, containerise with Docker and Kubernetes, script the repetitive work in PowerShell, and build CI/CD pipelines that make deployments routine. For years the goal was speed.',
    'Now I’m spending a deliberate year moving from DevOps to DevSecOps, and doing it in public. That means secret scanning before merge, IaC and Kubernetes policy checks in pull requests, quality gates that block a build, and hardened baselines, so the secure path is also the easiest one.',
  ],
  principles: [
    { k: 'Automate the second time', v: 'If I do it twice by hand, it becomes a script, a pipeline or a policy.' },
    { k: 'Shift left, then enforce', v: 'Detect issues in the pull request, then move to blocking them at deploy and at runtime.' },
    { k: 'Least privilege by default', v: 'Read-only tokens, scoped runners, SSH keys and RBAC unless there’s a reason not to.' },
    { k: 'Make it legible', v: 'SARIF in code scanning, KPI summaries in the job page. Security people actually read.' },
  ],
}

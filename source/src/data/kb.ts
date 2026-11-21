/* What the website assistant knows. Add onboarding answers, Instagram captions, video transcripts and
   anything else about the business to `notes`; everything here is sent to the AI with each question. */
import { contact, services, steps, faqGroups, cities, allProjects, values, nav } from './site';

export const notes: string[] = [
  'Owner: Jason. Apex Builders is a design build firm based in Chandler, Arizona.',
  'Building and renovating homes in Arizona since 2016, and in the trade here since 2008.',
  'Licensed, bonded and insured under Arizona ROC #350402.',
  'Travels 100+ miles for the right project.',
  /* [Add onboarding document answers here: hours, warranty, typical timelines, financing, brands used, team size, etc.] */
];

export const pages = [
  { label: 'Home', href: 'index.html', about: 'overview, services, projects, process, reviews, service areas' },
  { label: 'Services', href: 'services.html', about: 'custom homes, renovations, design build, commercial and TI' },
  { label: 'Projects', href: 'projects.html', about: 'finished projects with photos' },
  { label: 'Gallery', href: 'gallery.html', about: 'photos of kitchens, bathrooms, living spaces, exteriors, commercial' },
  { label: 'About', href: 'about.html', about: 'Jason, the team, values, history' },
  { label: 'FAQ', href: 'faq.html', about: 'pricing, timelines, design, licensing' },
  { label: 'Careers', href: 'careers.html', about: 'open roles and how to apply' },
  { label: 'Contact', href: 'contact.html', about: 'request a quote, phone, email, office address' },
];

const faqs = faqGroups.flatMap((g) => g.items);

/* Plain text brief sent to the AI */
export const brief = [
  'COMPANY: Apex Builders, custom homes, renovations, design build and commercial tenant improvements in the Phoenix Valley.',
  ...notes,
  `CONTACT: phone ${contact.phone}, email ${contact.email}, office ${contact.address}, Instagram @${contact.instagram}. Free quotes start with a site walk.`,
  'SERVICES:',
  ...services.map((s) => `- ${s.title}: ${s.text} Includes: ${s.includes.join('; ')}.`),
  'PROCESS:',
  ...steps.map((s, i) => `${i + 1}. ${s.title}: ${s.text}`),
  `SERVICE AREAS: ${cities.join(', ')}.`,
  `PROJECTS: ${allProjects.filter((p) => !p.title.startsWith('[')).map((p) => `${p.title} (${p.scope}, ${p.city})`).join('; ')}.`,
  `VALUES: ${values.map((v) => `${v.title}: ${v.text}`).join(' ')}`,
  'FAQ:',
  ...faqs.map((f) => `Q: ${f.q} A: ${f.a}`),
  'PAGES ON THIS WEBSITE:',
  ...pages.map((p) => `- ${p.label} (${p.href}): ${p.about}`),
].join('\n');

/* Small answer set for when no AI is connected: matched by keywords */
export const local = [
  { q: 'Gallery', a: 'Photos of kitchens, bathrooms, living spaces, exteriors and commercial work are in the [Gallery](gallery.html). Finished projects are on the [Projects](projects.html) page.', k: 'photo photos picture pictures see look gallery images kitchens bathrooms examples' },
  ...faqs.map((f) => ({ q: f.q, a: f.a, k: f.q })),
  { q: 'Services', a: `We build custom homes, do renovations (kitchens, baths, additions, whole home remodels), design build and commercial tenant improvements. See [Services](services.html).`, k: 'services offer do you build kitchen bathroom bath remodel addition renovation custom home commercial tenant improvement ti' },
  { q: 'Quote', a: `The quickest way to a quote is the form on the [Contact](contact.html) page or a call to ${contact.phone}. Every job starts with a site walk and gets a written proposal.`, k: 'quote estimate start contact consultation price free bid' },
  { q: 'Projects', a: 'You can see finished work on the [Projects](projects.html) page and more photos in the [Gallery](gallery.html).', k: 'projects work portfolio photos pictures gallery examples past' },
  { q: 'Careers', a: 'Open roles are on the [Careers](careers.html) page, where you can apply.', k: 'job jobs hiring career careers work for apply employment' },
  { q: 'Contact', a: `Call ${contact.phone}, email ${contact.email}, or visit ${contact.address}.`, k: 'phone call email address office where located location contact hours' },
  { q: 'About', a: 'Apex Builders is run by Jason and has been building in Arizona since 2016. More on the [About](about.html) page.', k: 'who owner jason about team history company' },
];

export const navLinks = nav;

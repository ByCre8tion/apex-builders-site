export const contact = {
  phone: '602.345.1071',
  tel: '+16023451071',
  email: 'info@apexbuildaz.com',
  address: '2225 W Pecos Rd, Suite 2, Chandler, AZ 85224',
  instagram: 'apexbuildersaz',
  roc: '350402',
};

export const nav = [
  { label: 'Services', href: 'services.html' },
  { label: 'Projects', href: 'projects.html' },
  { label: 'Gallery', href: 'gallery.html' },
  { label: 'About', href: 'about.html' },
  { label: 'FAQ', href: 'faq.html' },
  { label: 'Contact', href: 'contact.html' },
];
export const footerCompany = [
  { label: 'Projects', href: 'projects.html' },
  { label: 'Gallery', href: 'gallery.html' },
  { label: 'About', href: 'about.html' },
  { label: 'FAQ', href: 'faq.html' },
  { label: 'Careers', href: 'careers.html' },
  { label: 'Contact', href: 'contact.html' },
];

export const services = [
  { slug: 'custom-homes', slot: 'svc-custom', title: 'Custom home building', includes: ['Lot review, plans and permits', 'Selections for every room', 'Full construction management', 'Updates the whole way and a final walkthrough'], text: 'One of a kind homes designed around how your family lives, built from the ground up with nothing cut that you cannot see.', link: 'Plan your custom home', href: '#contact', alt: 'Finished custom home exterior at golden hour' },
  { slug: 'renovations', slot: 'svc-reno', title: 'Custom renovations', includes: ['Kitchens and bathrooms', 'Additions and whole home remodels', 'Structural, electrical and plumbing changes', 'A schedule you can plan around'], text: 'Kitchens, baths, additions and whole home remodels for homes that no longer fit the way you live.', link: 'Start a remodel', href: '#contact', alt: 'Remodeled kitchen with an island' },
  { slug: 'design-build', slot: 'svc-design', title: 'Design build', includes: ['Design and construction under one contract', 'One point of contact from plans to keys', 'Budget checked against the design as it develops', 'Subs and crew walk the job before pricing is locked'], text: 'Design and construction under one roof. One point of contact, one schedule and no finger pointing between trades.', link: 'See how it works', href: '#process', alt: 'Construction plans for a custom home' },
  { slug: 'commercial', slot: 'svc-commercial', title: 'Commercial and TI', includes: ['Tenant improvements and build outs', 'Retail, office and service spaces', 'Work scheduled around your business', 'Coordination with landlords and property managers'], text: 'Tenant improvements and commercial renovations for business owners, developers and property managers.', link: 'Discuss your space', href: '#contact', alt: 'Finished commercial interior' },
];

export const allProjects = [
  { slug: 'walling', slot: 'proj-walling', title: 'Walling Project', city: 'Phoenix', scope: 'Residential remodel', type: 'Residential', year: '[Year]', alt: 'Walling Project: home and pool at dusk', featured: true },
  { slug: 'prester', slot: 'proj-prester', title: 'Prester Project', city: 'Phoenix', scope: 'Residential remodel', type: 'Residential', year: '[Year]', alt: 'Prester Project: patio overlooking the desert', featured: true },
  { slug: 'little-princess-spa', slot: 'proj-lps', title: 'Little Princess Spa', city: 'Tempe', scope: 'Commercial TI', type: 'Commercial', year: '[Year]', alt: 'Little Princess Spa finished interior', featured: true },
  { slug: 'custom-home', slot: 'proj-custom', title: '[Custom home]', city: '[City]', scope: 'Custom home build', type: 'Custom home', year: '[Year]', alt: 'Custom home exterior at dusk', featured: false },
];
export const projects = allProjects.filter((p) => p.featured);

export const steps = [
  { slot: 'step1', title: 'Call or referral', text: 'Tell us about the project. We take down the details and schedule a site walk.' },
  { slot: 'step2', title: 'Walk the site', text: 'We confirm the day before, meet you on site and listen to your vision. Ideas if you want them.' },
  { slot: 'step3', title: 'Budget and design', text: 'Timeline, budget, plans and design, all on the table from the first meeting.' },
  { slot: 'step4', title: 'Proposal for review', text: 'We put together a detailed proposal so you can review it against your budget.' },
  { slot: 'step5', title: 'Pricing locked', text: 'Our subs and crew walk the job so the final quote is accurate. Then we sign the contract.' },
  { slot: 'step6', title: 'Build and hand over', text: 'You get a schedule and start date, updates the whole way and a final walkthrough.' },
];

export const faq = [
  { q: 'What happens after I call?', a: 'We take down your details and schedule a site walk. The day before, we text or call to confirm the time still works for you.' },
  { q: 'How do you price the work?', a: 'We quote every job in writing. After the site walk you get a detailed proposal to review against your budget. Hidden conditions, selections and design changes can affect cost, so we walk you through those up front. Once our subs and crew walk the job, we send final pricing for approval.' },
  { q: 'What does a project typically cost?', a: 'It depends on scope, size and finishes. Many of our remodel clients invest between $100,000 and $500,000, and custom homes run higher. Every job gets a written quote after a site walk.' },
  { q: 'Will my project finish on time?', a: 'You get a schedule and a start date before work begins, and updates the whole way. Delays can happen, and when they do you hear it from us first, with a plan.' },
  { q: 'Do you handle the design too?', a: 'Yes. As a design build firm we take your project from plans and selections through construction, with one team and one point of contact.' },
  { q: 'Are you licensed and insured?', a: 'Yes. Apex Builders is licensed, bonded and insured under ROC #350402. We work across 18 cities in the Valley and travel 100+ miles for the right project.' },
];

export const cities = ['Paradise Valley', 'Scottsdale', 'Phoenix', 'Chandler', 'Gilbert', 'Queen Creek', 'Tempe', 'Mesa', 'Fountain Hills', 'Cave Creek', 'Anthem', 'Glendale', 'Surprise', 'Goodyear', 'Avondale', 'San Tan Valley', 'Gold Canyon', 'Rio Verde'];

export const projectTypes = ['Custom home', 'Kitchen remodel', 'Bathroom remodel', 'Addition', 'Whole home remodel', 'Commercial or TI'];
export const budgets = ['Under $50,000', '$50,000 to $100,000', '$100,000 to $250,000', '$250,000 to $500,000', '$500,000 to $1,000,000', 'Over $1,000,000', 'Not sure yet'];
export const sources = ['Google search', 'Google Maps', 'ChatGPT or another AI assistant', 'Instagram', 'Facebook', 'Referred by a friend or family member', 'Referred by a contractor, designer or realtor', 'Saw a job site or truck', 'Other'];

export const faqGroups = [
  { title: 'Getting started', items: [
    { q: 'What happens after I call?', a: 'We take down your details and schedule a site walk. The day before, we text or call to confirm the time still works for you.' },
    { q: 'What areas do you serve?', a: 'Paradise Valley, Scottsdale, Phoenix and 15 more cities across the Valley. For the right project we travel 100+ miles.' },
    { q: 'Do you handle the design too?', a: 'Yes. As a design build firm we take your project from plans and selections through construction, with one team and one point of contact.' },
  ] },
  { title: 'Pricing', items: [
    { q: 'How do you price the work?', a: 'We quote every job in writing. After the site walk you get a detailed proposal to review against your budget. Once our subs and crew walk the job, we send updated pricing for approval.' },
    { q: 'What does a project typically cost?', a: 'It depends on scope, size and finishes. Many of our remodel clients invest between $100,000 and $500,000, and custom homes run higher. Every job gets a written quote after a site walk.' },
    { q: 'Can the final price change?', a: 'Hidden conditions, material selections and design changes can affect cost. We walk you through those possibilities up front, so nothing shows up as a surprise.' },
    { q: 'Why not go with the lowest bid?', a: 'Unusually low bids often leave out costs, use cheaper materials or skip steps that turn into expensive repairs later. The cheapest estimate is rarely the best value.' },
  ] },
  { title: 'During the build', items: [
    { q: 'Will my project finish on time?', a: 'You get a schedule and a start date before work begins, and updates the whole way. Delays can happen, and when they do you hear it from us first, with a plan.' },
    { q: 'Who do I talk to during the project?', a: 'One point of contact from the first call to the final walkthrough, so you always know who to ask.' },
  ] },
  { title: 'Licensing', items: [
    { q: 'Are you licensed and insured?', a: 'Yes. Apex Builders is licensed, bonded and insured under ROC #350402.' },
  ] },
];

export const galleryCats = ['Kitchens', 'Bathrooms', 'Living spaces', 'Exteriors', 'Commercial'];
export const gallery = [
  { slot: 'gal-1', cat: 'Kitchens', label: 'Kitchen, wide shot', shape: 'tall' },
  { slot: 'gal-2', cat: 'Exteriors', label: 'Front exterior at dusk', shape: 'wide' },
  { slot: 'gal-3', cat: 'Bathrooms', label: 'Primary bathroom', shape: '' },
  { slot: 'gal-4', cat: 'Living spaces', label: 'Great room', shape: '' },
  { slot: 'gal-5', cat: 'Kitchens', label: 'Island and range detail', shape: '' },
  { slot: 'gal-6', cat: 'Commercial', label: 'Commercial interior', shape: 'wide' },
  { slot: 'gal-7', cat: 'Exteriors', label: 'Backyard and pool', shape: 'tall' },
  { slot: 'gal-8', cat: 'Bathrooms', label: 'Shower and tile detail', shape: '' },
  { slot: 'gal-9', cat: 'Living spaces', label: 'Built ins and shelving', shape: '' },
  { slot: 'gal-10', cat: 'Kitchens', label: 'Pantry or bar', shape: '' },
  { slot: 'gal-11', cat: 'Exteriors', label: 'Entry and front door', shape: '' },
  { slot: 'gal-12', cat: 'Commercial', label: 'Reception or storefront', shape: '' },
];

export const values = [
  { title: 'Every detail counts', text: 'What is behind the walls matters as much as what you see. We build it right, not just make it look right.' },
  { title: 'Make it right', text: 'We are not perfect. When something goes wrong you hear it from us first, with a plan to fix it.' },
  { title: 'No chasing', text: 'One point of contact, regular updates and answers before you have to ask for them.' },
];

export const roles = [
  { title: '[Role title]', type: '[Full time]', where: '[Valley wide]', text: '[A short description of the role and what a good week looks like.]' },
  { title: '[Role title]', type: '[Full time]', where: '[Valley wide]', text: '[A short description of the role and what a good week looks like.]' },
];
export const perks = [
  { title: 'Steady work', text: 'Projects across 18 cities in the Valley, scheduled ahead.' },
  { title: 'Clear plans', text: 'Every job starts with a written scope and a schedule, so you know what the week holds.' },
  { title: 'Craft that is respected', text: 'We would rather do it once and properly. Good work is noticed here.' },
];

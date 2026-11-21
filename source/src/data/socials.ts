/* Social profiles. Swap the empty links for the real ones; empty ones point to # until then. */
import paths from './icon-paths.json';
export const socials = [
  { key: 'google', label: 'Google Business Profile', href: '' },
  { key: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/apexbuildersaz/' },
  { key: 'facebook', label: 'Facebook', href: '' },
  { key: 'youtube', label: 'YouTube', href: '' },
  { key: 'tiktok', label: 'TikTok', href: '' },
  { key: 'x', label: 'X', href: '' },
  { key: 'houzz', label: 'Houzz', href: '' },
].map((s) => ({ ...s, path: (paths as Record<string, string>)[s.key] }));

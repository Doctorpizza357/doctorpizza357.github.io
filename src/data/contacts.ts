import type { ContactMethod, SocialLink } from './types';

export const contactMethods: ContactMethod[] = [
  {
    type: 'email',
    label: 'Email',
    value: 'tomasbentolila@gmail.com',
    href: 'mailto:tomasbentolila@gmail.com',
  },
];

export const socialLinks: SocialLink[] = [
  {
    platform: 'github',
    url: 'https://github.com/doctorpizza357',
    label: 'GitHub',
  },
  {
    platform: 'twitter',
    url: 'https://twitter.com/doctorpizza357',
    label: 'Twitter / X',
  },
  {
    platform: 'instagram',
    url: 'https://www.instagram.com/tomasbentolila',
    label: 'Instagram',
  },
];

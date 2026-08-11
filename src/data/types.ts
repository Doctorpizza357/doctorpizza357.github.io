export interface CaseStudyData {
  id: string;
  title: string;
  summary: string;
  technologies: string[];
  description?: string;
  images?: string[];
  repositoryUrl?: string;
  caseStudySections?: CaseStudySection[];
}

export interface CaseStudySection {
  heading: string;
  body: string;
}

export interface TimelineEntryData {
  date: string;
  title: string;
  description: string;
}

export interface LabNoteData {
  date: string;
  content: string;
}

export interface SectionContent {
  id: string;
  title?: string;
  body: string;
  images?: SectionImage[];
}

export interface SectionImage {
  src: string;
  /** Descriptive alt text for informational images (max 125 chars), or empty string for decorative */
  alt: string;
}

export interface ContactMethod {
  type: 'email' | 'whatsapp' | 'discord';
  label: string;
  value: string;
  href: string;
}

export interface SocialLink {
  platform: 'github' | 'twitter' | 'instagram' | 'discord';
  url: string;
  label: string;
}

export interface SiteMetadata {
  name: string;
  title: string;
  description: string;
  ogImage: string;
  baseUrl: string;
  faviconSizes: { size: string; href: string }[];
}

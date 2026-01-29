/**
 * Home Page Configuration
 * Centralized configuration for easy customization
 */

export interface ServiceCard {
  id: string;
  title: string;
  description: string;
  route: string;
  linkText: string;
  gradient: string;
  icon: string;
}

export interface HowItWorksStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  gradient: string;
}

export interface HeroStat {
  id: string;
  value: number;
  suffix: string;
  label: string;
  icon: string;
}

/**
 * Service Cards Configuration
 */
export const SERVICE_CARDS: ServiceCard[] = [
  {
    id: 'jobs',
    title: 'Find Jobs',
    description: 'Your gateway to endless possibilities and exciting career opportunities',
    route: '/job',
    linkText: 'Browse jobs',
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
    icon: 'briefcase'
  },
  {
    id: 'missions',
    title: 'Find Missions',
    description: 'Discover freelance opportunities and connect with exciting projects',
    route: '/freelance',
    linkText: 'Browse missions',
    gradient: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
    icon: 'layers'
  },
  {
    id: 'voice',
    title: 'HR Voice',
    description: 'Your connected local company and ultimate resources',
    route: '/voice',
    linkText: 'Last news',
    gradient: 'linear-gradient(135deg, #F7B731 0%, #F79F1F 100%)',
    icon: 'message'
  },
  {
    id: 'coaching',
    title: 'Career Coaching',
    description: 'Personalized guidance to boost your career with our HR experts',
    route: '/coaching-emploi',
    linkText: 'Discover',
    gradient: 'linear-gradient(135deg, #A8E6CF 0%, #7FB069 100%)',
    icon: 'help'
  }
];

/**
 * How It Works Steps Configuration
 */
export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    id: 'step-1',
    title: 'Get Going',
    description: 'Create your account and complete your profile to get started with our platform',
    icon: 'person',
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)'
  },
  {
    id: 'step-2',
    title: 'Get Online',
    description: 'Browse through opportunities and connect with companies that match your goals',
    icon: 'list',
    gradient: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)'
  },
  {
    id: 'step-3',
    title: 'Save More',
    description: 'Apply to positions and save your favorite opportunities for later review',
    icon: 'check',
    gradient: 'linear-gradient(135deg, #F7B731 0%, #F79F1F 100%)'
  }
];

/**
 * Hero Statistics Configuration
 */
export const HERO_STATS: HeroStat[] = [
  {
    id: 'stat-1',
    value: 20000,
    suffix: 'k+',
    label: 'Event Planned',
    icon: 'star'
  },
  {
    id: 'stat-2',
    value: 260,
    suffix: '',
    label: 'Event Organizer',
    icon: 'people'
  }
];

/**
 * Hero Section Configuration
 */
export const HERO_CONFIG = {
  subtitle: 'Exceeding Career Expectations',
  title: 'Creating the Best. Day.',
  titleAccent: 'Ever.',
  image: 'assets/img/card-preview.png',
  imageAlt: 'Talenteed Preview'
};

/**
 * CTA Section Configuration
 */
export const CTA_CONFIG = {
  subtitle: 'Exceeding career expectations',
  title: 'Creating the Best. Day.',
  titleAccent: 'Ever.',
  buttonText: 'Get Started',
  buttonRoute: '/job',
  gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
};

/**
 * Section Titles Configuration
 */
export const SECTION_TITLES = {
  howItWorks: {
    title: 'How it work',
    subtitle: 'A few steps to get started in 3 steps'
  },
  featuredJobs: {
    title: 'Our live opportunities'
  },
  hrMedia: {
    title: 'Your <span class="accent">connected</span> local company and ultimate <span class="accent">resources</span>'
  },
  partners: {
    title: 'Trusted by leading companies'
  }
};

/**
 * Animation Configuration
 */
export const ANIMATION_CONFIG = {
  counterDuration: 2000, // milliseconds
  counterSteps: 60,
  hoverTransition: '0.3s ease',
  cardHoverLift: '-8px',
  buttonHoverLift: '-2px'
};

/**
 * Responsive Breakpoints
 */
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 968,
  desktop: 1200
};

/**
 * Color Palette (for reference)
 */
export const COLOR_PALETTE = {
  primary: '#1967d2',
  secondary: '#eb5432',
  background: '#f5f7fc',
  black: '#202124',
  textColor: '#696969',
  white: '#ffffff'
};

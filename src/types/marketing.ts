export interface Feature {
  id: string
  title: string
  description: string
  icon: string
  benefits: string[]
  businessValue: string
  image?: string
}

export interface PricingPlan {
  id: string
  name: string
  description: string
  priceMonthly: number
  priceYearly: number
  users: number
  storage: string
  tickets: string
  features: string[]
  isPopular?: boolean
  ctaText: string
}

export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  content: string
  avatar?: string
  rating: number
}

export interface FAQ {
  id: string
  question: string
  answer: string
}

export interface Statistic {
  id: string
  value: string
  label: string
  icon: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  avatar?: string
  socialLinks?: {
    linkedin?: string
    twitter?: string
    github?: string
  }
}

export interface NavItem {
  label: string
  href: string
  isExternal?: boolean
}
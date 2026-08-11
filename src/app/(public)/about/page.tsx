'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  ArrowRight, 
  Check, 
  Users, 
  Target, 
  Eye, 
  Heart, 
  Zap, 
  Shield, 
  TrendingUp,
  Code,
  Database,
  Cloud,
  Lock,
  Mail,
  Award,
  Rocket,
  Building2,
  Sparkles,
  Globe,
  MessageSquare,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

const coreValues = [
  {
    icon: Users,
    title: 'Customer-Centric',
    description: 'We put our customers at the heart of everything we do. Their success is our success.',
  },
  {
    icon: Target,
    title: 'Innovation',
    description: 'We continuously push boundaries to deliver cutting-edge solutions that solve real problems.',
  },
  {
    icon: Heart,
    title: 'Integrity',
    description: 'We operate with transparency, honesty, and ethical practices in all our dealings.',
  },
  {
    icon: Shield,
    title: 'Security',
    description: 'We prioritize the security and privacy of our customers\' data above all else.',
  },
]

const teamMembers = [
  {
    name: 'Alex Thompson',
    role: 'CEO & Co-Founder',
    bio: 'Former Head of Support at a Fortune 500 company with 15+ years of experience in customer experience.',
    avatar: 'https://ui-avatars.com/api/?name=Alex+Thompson&background=FF7A00&color=fff&size=128',
  },
  {
    name: 'Sarah Chen',
    role: 'CTO & Co-Founder',
    bio: 'Full-stack engineer with expertise in scalable SaaS architectures and multi-tenant systems.',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=003366&color=fff&size=128',
  },
  {
    name: 'Michael Rodriguez',
    role: 'Head of Product',
    bio: 'Product strategist with a passion for creating intuitive user experiences that delight customers.',
    avatar: 'https://ui-avatars.com/api/?name=Michael+Rodriguez&background=FF7A00&color=fff&size=128',
  },
  {
    name: 'Emily Watson',
    role: 'Lead Designer',
    bio: 'Award-winning designer focused on creating beautiful, accessible, and user-friendly interfaces.',
    avatar: 'https://ui-avatars.com/api/?name=Emily+Watson&background=003366&color=fff&size=128',
  },
  {
    name: 'David Kim',
    role: 'Head of Engineering',
    bio: 'Engineering leader with a track record of building high-performance, scalable applications.',
    avatar: 'https://ui-avatars.com/api/?name=David+Kim&background=FF7A00&color=fff&size=128',
  },
  {
    name: 'Lisa Patel',
    role: 'Customer Success Lead',
    bio: 'Customer experience expert dedicated to ensuring every customer achieves their goals.',
    avatar: 'https://ui-avatars.com/api/?name=Lisa+Patel&background=003366&color=fff&size=128',
  },
]

const technologies = [
  { name: 'Next.js', icon: '⚡', category: 'Frontend' },
  { name: 'TypeScript', icon: '📘', category: 'Frontend' },
  { name: 'Tailwind CSS', icon: '🎨', category: 'Frontend' },
  { name: 'NestJS', icon: '🚀', category: 'Backend' },
  { name: 'Prisma', icon: '🗄️', category: 'Backend' },
  { name: 'PostgreSQL', icon: '🐘', category: 'Database' },
  { name: 'WebSockets', icon: '🔌', category: 'Real-time' },
  { name: 'Redis', icon: '⚡', category: 'Caching' },
  { name: 'Docker', icon: '🐳', category: 'DevOps' },
  { name: 'AWS', icon: '☁️', category: 'Cloud' },
]

const achievements = [
  {
    icon: Rocket,
    value: '10,000+',
    label: 'Organizations Served',
  },
  {
    icon: TrendingUp,
    value: '1.5M+',
    label: 'Tickets Processed',
  },
  {
    icon: Award,
    value: '98%',
    label: 'Customer Satisfaction',
  },
  {
    icon: Sparkles,
    value: '4.5min',
    label: 'Average Response Time',
  },
]

const roadmapItems = [
  {
    quarter: 'Q4 2024',
    title: 'Advanced AI Capabilities',
    description: 'Integrate AI-powered ticket classification and response suggestions.',
    status: 'In Progress',
  },
  {
    quarter: 'Q1 2025',
    title: 'Enhanced Analytics',
    description: 'Predictive analytics and advanced reporting capabilities.',
    status: 'Planned',
  },
  {
    quarter: 'Q2 2025',
    title: 'Mobile App',
    description: 'Native mobile applications for iOS and Android.',
    status: 'Planned',
  },
  {
    quarter: 'Q3 2025',
    title: 'Global Expansion',
    description: 'Multi-language support and regional data centers.',
    status: 'Planned',
  },
]

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-primary/10 text-primary">About Us</Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl font-poppins">
              Building the Future of{' '}
              <span className="text-primary">Customer Support</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              We&apos;re on a mission to transform how businesses interact with their customers, 
              making support effortless, intelligent, and delightful.
            </p>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 bg-primary/10 text-primary">Our Story</Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-poppins">
                Empowering Businesses to Delight Their Customers
              </h2>
              <div className="mt-6 space-y-4 text-muted-foreground">
                <p>
                  SupportFlow was born from a simple observation: customer support is broken. 
                  Businesses struggle with scattered tools, disconnected data, and siloed teams. 
                  Customers wait too long for answers and repeat themselves endlessly.
                </p>
                <p>
                  We set out to build a platform that brings everything together - ticketing, 
                  feedback, knowledge base, and analytics - in one seamless experience. 
                  A platform that empowers support teams to do their best work.
                </p>
                <p>
                  Today, SupportFlow helps thousands of organizations around the world 
                  deliver exceptional customer experiences. And We&apos;re just getting started.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/contact">
                  <Button className="bg-primary hover:bg-primary/90">
                    Get in Touch
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/features">
                  <Button variant="outline">Explore Our Features</Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 p-8 border">
                <div className="grid gap-4">
                  <div className="flex items-center gap-4 p-4 bg-card rounded-xl shadow-sm">
                    <div className="rounded-lg bg-primary/10 p-3">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Founded in 2023</p>
                      <p className="text-sm text-muted-foreground">With a vision for better support</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-card rounded-xl shadow-sm">
                    <div className="rounded-lg bg-secondary/10 p-3">
                      <Globe className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <p className="font-semibold">Global Team</p>
                      <p className="text-sm text-muted-foreground">Working across 12 countries</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-card rounded-xl shadow-sm">
                    <div className="rounded-lg bg-success/10 p-3">
                      <MessageSquare className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <p className="font-semibold">100% Customer-Focused</p>
                      <p className="text-sm text-muted-foreground">Built with customers, for customers</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-24 bg-secondary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center md:text-left"
            >
              <div className="inline-flex items-center justify-center rounded-full bg-white/10 p-3 mb-4">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold font-poppins mb-4">Our Mission</h3>
              <p className="text-white/80">
                To empower every business to deliver exceptional customer experiences 
                through intelligent, intuitive, and integrated support solutions.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center md:text-left"
            >
              <div className="inline-flex items-center justify-center rounded-full bg-white/10 p-3 mb-4">
                <Eye className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold font-poppins mb-4">Our Vision</h3>
              <p className="text-white/80">
                A world where every customer interaction is seamless, every issue is resolved 
                efficiently, and every support team is empowered to excel.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary">Core Values</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-poppins">
              What Drives Us
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              The principles that guide everything we do at SupportFlow
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {coreValues.map((value, index) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="mx-auto mb-4 rounded-full bg-primary/10 p-3 w-14 h-14 flex items-center justify-center">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                      <p className="text-muted-foreground">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="py-16 md:py-24 bg-surface">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary">Our Team</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-poppins">
              The People Behind SupportFlow
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              A diverse team of passionate individuals dedicated to transforming customer support
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Avatar className="mx-auto h-24 w-24 border-4 border-primary/20">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="mt-4 text-xl font-semibold">{member.name}</h3>
                    <p className="text-sm text-primary font-medium">{member.role}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{member.bio}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary">Technology Stack</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-poppins">
              Built with Modern Technologies
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We use cutting-edge technologies to deliver a robust, scalable, and secure platform
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="text-3xl mb-2">{tech.icon}</div>
                    <p className="font-semibold text-sm">{tech.name}</p>
                    <p className="text-xs text-muted-foreground">{tech.category}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon
              return (
                <motion.div
                  key={achievement.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-3 mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-3xl font-bold font-poppins">{achievement.value}</div>
                  <div className="text-sm text-muted-foreground">{achievement.label}</div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary">Roadmap</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-poppins">
              Our Future Vision
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              What We&apos;re building next to serve you better
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {roadmapItems.map((item, index) => (
              <motion.div
                key={item.quarter}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-lg border bg-card p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        {item.quarter}
                      </Badge>
                      <h3 className="font-semibold">{item.title}</h3>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <Badge
                    className={cn(
                      item.status === 'In Progress'
                        ? 'bg-success/10 text-success'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {item.status}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-secondary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-poppins">
            Ready to Transform Your Support?
          </h2>
          <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
            Join thousands of organizations already using SupportFlow to deliver 
            exceptional customer experiences.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/pricing">
              <Button size="lg" className="bg-white text-secondary hover:bg-white/90">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
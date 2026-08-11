'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Check, Star, Users, Ticket, Clock, TrendingUp, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// Sample data
const features = [
  {
    title: 'Ticket Management',
    description: 'Powerful ticket management with automated routing, prioritization, and SLA tracking.',
    icon: Ticket,
  },
  {
    title: 'Customer Feedback',
    description: 'Collect and analyze customer feedback to continuously improve your support experience.',
    icon: Star,
  },
  {
    title: 'Knowledge Base',
    description: 'Create a self-service knowledge base to help customers find answers instantly.',
    icon: '📚',
  },
  {
    title: 'Real-Time Notifications',
    description: 'Stay informed with real-time notifications across all your devices.',
    icon: '🔔',
  },
  {
    title: 'Analytics & Reports',
    description: 'Make data-driven decisions with comprehensive analytics and custom reports.',
    icon: TrendingUp,
  },
  {
    title: 'Team Collaboration',
    description: 'Collaborate seamlessly with your team using internal notes and shared views.',
    icon: Users,
  },
]

const testimonials = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Head of Customer Support',
    company: 'TechCorp Inc.',
    content: 'SupportFlow has transformed how we handle customer support. Our response time decreased by 60% and customer satisfaction is at an all-time high.',
    rating: 5,
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'CEO',
    company: 'StartupHub',
    content: 'The multi-tenant architecture makes it perfect for our SaaS platform. We can manage all our clients from one dashboard.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    role: 'Operations Manager',
    company: 'CloudSolutions',
    content: 'The feedback system has been invaluable. We\'re now making data-driven improvements based on real customer insights.',
    rating: 5,
  },
]

const stats = [
  { value: '10,000+', label: 'Organizations Served', icon: Users },
  { value: '1.5M+', label: 'Tickets Processed', icon: Ticket },
  { value: '98%', label: 'Customer Satisfaction', icon: Star },
  { value: '4.5min', label: 'Average Response Time', icon: Clock },
]

const faqs = [
  {
    question: 'What is SupportFlow?',
    answer: 'SupportFlow is a comprehensive customer support and feedback management platform designed for modern SaaS businesses. It combines ticketing, feedback collection, knowledge base, and analytics in one powerful solution.',
  },
  {
    question: 'How does the multi-tenant architecture work?',
    answer: 'SupportFlow is built with a multi-tenant architecture, meaning each organization gets their own isolated workspace. Data is securely separated, and each tenant can customize their experience.',
  },
  {
    question: 'Can I customize the customer portal?',
    answer: 'Absolutely! You can customize the customer portal with your branding, colors, logo, and even create custom fields and workflows to match your business needs.',
  },
  {
    question: 'What integrations are available?',
    answer: 'SupportFlow integrates with popular tools like Slack, email, and provides a robust API for custom integrations. We also support webhooks for real-time data synchronization.',
  },
]

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
                🚀 The Future of Customer Support
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl font-poppins">
                Delight Your Customers with{' '}
                <span className="text-primary">Exceptional Support</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
                The all-in-one customer support platform that combines ticketing, 
                feedback management, and knowledge base to deliver outstanding 
                customer experiences.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/pricing">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/features">
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-success" />
                  <span>Free 14-day trial</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-success" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-success" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="rounded-2xl bg-card shadow-2xl p-4 border">
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <Image
                    src="/ticket.png"
                    alt="SupportFlow dashboard"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                    className="object-cover"
                  />
                </div>
              </div>
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 rounded-full bg-success/10 p-3">
                <Check className="h-6 w-6 text-success" />
              </div>
              <div className="absolute -bottom-4 -left-4 rounded-full bg-primary/10 p-3">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground mb-8">
            Trusted by innovative companies worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-50">
            {['Acme Corp', 'TechCorp', 'StartupHub', 'CloudSolutions', 'DataFlow', 'InnovateLabs'].map(
              (company) => (
                <span key={company} className="text-lg font-semibold text-muted-foreground">
                  {company}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* Why Choose SupportFlow */}
      <section className="py-16 md:py-24 bg-surface">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary">Why Choose Us</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-poppins">
              Built for Modern Support Teams
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything you need to deliver exceptional customer support at scale
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="mb-4 rounded-lg bg-primary/10 p-3 w-12 h-12 flex items-center justify-center">
                        {typeof Icon === 'string' ? (
                          <span className="text-2xl">{Icon}</span>
                        ) : (
                          <Icon className="h-6 w-6 text-primary" />
                        )}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary">How It Works</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-poppins">
              Get Started in 5 Simple Steps
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From setup to success in minutes
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-5">
            {[
              { step: '1', title: 'Sign Up', description: 'Create your organization account' },
              { step: '2', title: 'Invite Team', description: 'Add support agents and customers' },
              { step: '3', title: 'Create Tickets', description: 'Customers submit support requests' },
              { step: '4', title: 'Resolve Issues', description: 'Agents manage and resolve tickets' },
              { step: '5', title: 'Get Feedback', description: 'Collect customer satisfaction data' },
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center text-2xl font-bold text-primary">
                    {step.step}
                  </div>
                  <h4 className="font-semibold mb-2">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                  {index < 4 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-primary/20" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-secondary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4 bg-white/10 text-white">Testimonials</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-poppins">
              What Our Customers Say
            </h2>
            <p className="mt-4 text-lg text-white/80">
              Real stories from real companies
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 h-full">
                  <CardContent className="p-6 text-white">
                    <div className="flex gap-0.5 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                      ))}
                    </div>
                    <p className="text-white/90 mb-4">"{testimonial.content}"</p>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-white/70">
                        {testimonial.role}, {testimonial.company}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-3 mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-3xl font-bold font-poppins">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-16 md:py-24 bg-surface">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary">Pricing</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-poppins">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Choose the plan that fits your business needs
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {[
              {
                name: 'Starter',
                price: '$29',
                description: 'Perfect for small teams',
                features: ['5 users', '100 tickets/month', 'Basic analytics', 'Email support'],
              },
              {
                name: 'Professional',
                price: '$79',
                description: 'For growing businesses',
                features: ['20 users', 'Unlimited tickets', 'Advanced analytics', 'Priority support'],
                popular: true,
              },
              {
                name: 'Business',
                price: '$199',
                description: 'For large organizations',
                features: ['Unlimited users', 'Unlimited tickets', 'Custom reports', '24/7 support'],
              },
            ].map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={cn(
                  'rounded-2xl border p-8 text-center bg-card',
                  plan.popular
                    ? 'border-primary shadow-lg'
                    : 'border-border'
                )}
              >
                {plan.popular && (
                  <Badge className="mb-4 bg-primary text-white">Most Popular</Badge>
                )}
                <h3 className="text-2xl font-bold font-poppins">{plan.name}</h3>
                <div className="mt-4 flex items-baseline justify-center">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="ml-1 text-muted-foreground">/month</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                <ul className="mt-6 space-y-2 text-left">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-success flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/pricing">
                  <Button
                    className={cn(
                      'mt-8 w-full',
                      plan.popular
                        ? 'bg-primary hover:bg-primary/90'
                        : 'bg-secondary hover:bg-secondary/90'
                    )}
                  >
                    Get Started
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary">FAQ</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-poppins">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="overflow-hidden rounded-lg border bg-card"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-muted/50"
                  aria-expanded={openFaq === index}
                >
                  <h3 className="font-semibold">{faq.question}</h3>
                  <ChevronDown
                    className={cn(
                      'h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform duration-300',
                      openFaq === index && 'rotate-180'
                    )}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="px-5 pb-5 text-muted-foreground">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-poppins">
            Ready to Transform Your Customer Support?
          </h2>
          <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
            Join thousands of organizations already using SupportFlow to deliver exceptional customer experiences.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/pricing">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { 
  ArrowRight, 
  Check, 
  Users, 
  Ticket, 
  Star, 
  BookOpen, 
  Bell, 
  TrendingUp,
  Shield,
  Zap,
  Globe,
  FileText,
  MessageSquare,
  Lock,
  Database,
  Cloud,
  Code,
  Smartphone,
  BarChart3,
  Clock,
  UserPlus,
  Mail,
  RefreshCw,
  Layers,
  Building2,
  FolderOpen,
  Send,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const features = [
  {
    category: 'Customer Experience',
    features: [
      {
        title: 'Customer Portal',
        description: 'A branded portal where customers can submit tickets, track progress, and access knowledge base articles.',
        benefits: ['Self-service support', '24/7 access', 'Reduced ticket volume'],
        businessValue: 'Increase customer satisfaction by 40%',
        icon: Users,
      },
      {
        title: 'Ticket Management',
        description: 'Powerful ticket management with automated routing, prioritization, and SLA tracking.',
        benefits: ['Faster resolution times', 'Better organization', 'SLA compliance'],
        businessValue: 'Reduce response time by 60%',
        icon: Ticket,
      },
      {
        title: 'Customer Feedback',
        description: 'Collect and analyze customer feedback to continuously improve your support experience.',
        benefits: ['Data-driven improvements', 'Customer insights', 'Satisfaction tracking'],
        businessValue: 'Improve customer retention by 25%',
        icon: Star,
      },
    ],
  },
  {
    category: 'Team Productivity',
    features: [
      {
        title: 'Knowledge Base',
        description: 'Create a self-service knowledge base to help customers find answers instantly.',
        benefits: ['Reduce support tickets', 'Empower customers', 'Consistent answers'],
        businessValue: 'Reduce support costs by 30%',
        icon: BookOpen,
      },
      {
        title: 'Real-Time Notifications',
        description: 'Stay informed with real-time notifications across all your devices.',
        benefits: ['Immediate updates', 'Never miss a ticket', 'Faster response'],
        businessValue: 'Improve team response time by 50%',
        icon: Bell,
      },
      {
        title: 'Team Collaboration',
        description: 'Collaborate seamlessly with your team using internal notes and shared views.',
        benefits: ['Better teamwork', 'Knowledge sharing', 'Reduced silos'],
        businessValue: 'Increase team efficiency by 35%',
        icon: Users,
      },
    ],
  },
  {
    category: 'Analytics & Insights',
    features: [
      {
        title: 'Analytics & Reports',
        description: 'Make data-driven decisions with comprehensive analytics and custom reports.',
        benefits: ['Data-driven decisions', 'Performance tracking', 'Insight generation'],
        businessValue: 'Increase operational efficiency by 45%',
        icon: BarChart3,
      },
      {
        title: 'Performance Metrics',
        description: 'Track key metrics like response time, resolution rate, and customer satisfaction.',
        benefits: ['Measure success', 'Identify bottlenecks', 'Optimize processes'],
        businessValue: 'Improve team performance by 50%',
        icon: TrendingUp,
      },
    ],
  },
  {
    category: 'Platform & Security',
    features: [
      {
        title: 'Multi-Tenant Architecture',
        description: 'Built on a secure multi-tenant architecture with complete data isolation between organizations.',
        benefits: ['Data isolation', 'Scalability', 'Security compliance'],
        businessValue: 'Enterprise-grade security and scalability',
        icon: Layers,
      },
      {
        title: 'Role-Based Access Control',
        description: 'Granular permissions for different user roles including platform admins, tenant owners, agents, and customers.',
        benefits: ['Security', 'Controlled access', 'Audit trail'],
        businessValue: 'Maintain security and compliance',
        icon: Shield,
      },
      {
        title: 'Secure Multi-Tenant Isolation',
        description: 'Every organization gets fully isolated data on one shared application URL, with tenant boundaries enforced server-side.',
        benefits: ['Data isolation', 'One application URL', 'Enterprise-grade security'],
        businessValue: 'Scale confidently with strong tenant isolation',
        icon: Globe,
      },
      {
        title: 'Secure File Uploads',
        description: 'Enterprise-grade file upload with support for images, PDFs, documents, and more.',
        benefits: ['Secure sharing', 'Multiple formats', 'Storage management'],
        businessValue: 'Safely exchange documents with customers',
        icon: FileText,
      },
      {
        title: 'Invitation System',
        description: 'Invite customers, support agents, and team members via email with role-based access.',
        benefits: ['Easy onboarding', 'Controlled access', 'Role assignment'],
        businessValue: 'Streamline user management',
        icon: UserPlus,
      },
    ],
  },
  {
    category: 'Integrations & Extensibility',
    features: [
      {
        title: 'API Integration',
        description: 'Robust REST API with OpenAPI documentation for custom integrations and automation.',
        benefits: ['Custom integrations', 'Automation', 'Extensibility'],
        businessValue: 'Connect with your existing stack',
        icon: Code,
      },
      {
        title: 'Email Notifications',
        description: 'Automated email notifications for ticket updates, responses, and feedback requests.',
        benefits: ['Automated communication', 'Customer engagement', 'Brand consistency'],
        businessValue: 'Improve customer communication by 40%',
        icon: Mail,
      },
      {
        title: 'Real-Time Updates',
        description: 'WebSocket-powered real-time updates for instant notifications and live collaboration.',
        benefits: ['Instant updates', 'Live collaboration', 'Better experience'],
        businessValue: 'Enhance team productivity by 30%',
        icon: RefreshCw,
      },
      {
        title: 'Mobile Responsiveness',
        description: 'Fully responsive design that works on desktop, tablet, and mobile devices.',
        benefits: ['Access anywhere', 'Flexible work', 'Better experience'],
        businessValue: 'Support teams on the go',
        icon: Smartphone,
      },
    ],
  },
]

export default function FeaturesPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-primary/10 text-primary">Features</Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl font-poppins">
            Everything You Need for{' '}
            <span className="text-primary">Exceptional Support</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-3xl mx-auto">
            Discover the powerful features that make SupportFlow the ultimate 
            customer support platform for modern businesses.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      {features.map((category, categoryIndex) => (
        <section
          key={category.category}
          className={cn(
            'py-16 md:py-24',
            categoryIndex % 2 === 0 ? 'bg-background' : 'bg-surface'
          )}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold tracking-tight font-poppins">
                {category.category}
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {category.features.map((feature, index) => {
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
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground mb-4">{feature.description}</p>
                        
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-primary mb-2">Benefits:</h4>
                          <ul className="space-y-1">
                            {feature.benefits.map((benefit) => (
                              <li key={benefit} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Check className="h-3 w-3 text-success flex-shrink-0" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm font-medium text-primary">
                            💡 {feature.businessValue}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>
      ))}

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-secondary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-poppins">
            Ready to Experience the Power of SupportFlow?
          </h2>
          <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
            Start your free trial today and see how SupportFlow can transform 
            your customer support operations.
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
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
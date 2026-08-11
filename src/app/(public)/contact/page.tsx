'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Send, 
  Globe,
  AtSign,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactFormValues = z.infer<typeof contactSchema>

const contactInfo = [
  {
    icon: Mail,
    title: 'Email Us',
    details: ['support@supportflow.com', 'sales@supportflow.com'],
    description: 'We\'ll respond within 24 hours',
  },
  {
    icon: Phone,
    title: 'Call Us',
    details: ['+1 (555) 123-4567'],
    description: 'Mon-Fri 9AM - 6PM EST',
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    details: ['123 Tech Park Drive', 'Silicon Valley, CA 94000'],
    description: 'United States',
  },
  {
    icon: Clock,
    title: 'Business Hours',
    details: ['Monday - Friday: 9AM - 6PM EST', 'Saturday: 10AM - 4PM EST'],
    description: '24/7 emergency support available',
  },
]

const faqs = [
  {
    question: 'What is the typical response time?',
    answer: 'We aim to respond to all inquiries within 24 hours during business days. For urgent issues, we offer priority support for our Enterprise customers.',
  },
  {
    question: 'Do you offer implementation support?',
    answer: 'Yes! We provide comprehensive onboarding and implementation support to ensure a smooth transition. Our team works closely with you to set up the platform.',
  },
  {
    question: 'Can I schedule a demo?',
    answer: 'Absolutely! You can request a demo through our contact form or book directly through our calendar. Our team will walk you through the platform and answer your questions.',
  },
  {
    question: 'Is there a free trial available?',
    answer: 'Yes, we offer a 14-day free trial with full access to all features. No credit card is required to start.',
  },
]

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      console.log('Contact form data:', data)
      setIsSubmitted(true)
      reset()
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-primary/10 text-primary">Contact Us</Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl font-poppins">
              Get in Touch with{' '}
              <span className="text-primary">SupportFlow</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Have questions about SupportFlow? We&apos;re here to help. Reach out to our team 
              and we&apos;ll get back to you as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold font-poppins mb-6">Send Us a Message</h2>
                  
                  {isSubmitted ? (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center justify-center rounded-full bg-success/10 p-3 mb-4">
                        <CheckCircle className="h-12 w-12 text-success" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
                      <p className="text-muted-foreground">
                        Your message has been sent successfully. we&apos;ll get back to you within 24 hours.
                      </p>
                      <Button
                        className="mt-6"
                        variant="outline"
                        onClick={() => setIsSubmitted(false)}
                      >
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            placeholder="John Doe"
                            {...register('name')}
                            className={cn(errors.name && 'border-destructive')}
                          />
                          {errors.name && (
                            <p className="text-sm text-destructive">{errors.name.message}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            {...register('email')}
                            className={cn(errors.email && 'border-destructive')}
                          />
                          {errors.email && (
                            <p className="text-sm text-destructive">{errors.email.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            placeholder="+1 (555) 000-0000"
                            {...register('phone')}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company">Company Name</Label>
                          <Input
                            id="company"
                            placeholder="Your Company"
                            {...register('company')}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                          id="subject"
                          placeholder="How can we help you?"
                          {...register('subject')}
                          className={cn(errors.subject && 'border-destructive')}
                        />
                        {errors.subject && (
                          <p className="text-sm text-destructive">{errors.subject.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          placeholder="Tell us about your inquiry..."
                          rows={6}
                          {...register('message')}
                          className={cn(errors.message && 'border-destructive')}
                        />
                        {errors.message && (
                          <p className="text-sm text-destructive">{errors.message.message}</p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Message
                            <Send className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {contactInfo.map((info, index) => {
                const Icon = info.icon
                return (
                  <Card key={info.title}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="rounded-full bg-primary/10 p-3 flex-shrink-0">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{info.title}</h3>
                          {info.details.map((detail) => (
                            <p key={detail} className="text-sm text-muted-foreground">
                              {detail}
                            </p>
                          ))}
                          <p className="text-sm text-primary mt-1">{info.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}

              {/* Social Links */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Connect With Us</h3>
                  <div className="flex gap-3">
                    {[
                      { icon: Globe, href: '#', label: 'Website' },
                      { icon: AtSign, href: '#', label: 'Twitter' },
                      { icon: Mail, href: '#', label: 'Email' },
                      { icon: MessageCircle, href: '#', label: 'Chat' },
                    ].map((social) => {
                      const Icon = social.icon
                      return (
                        <a
                          key={social.label}
                          href={social.href}
                          className="rounded-full bg-muted p-2 transition-colors hover:bg-primary/10 hover:text-primary"
                          aria-label={social.label}
                        >
                          <Icon className="h-5 w-5" />
                        </a>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-surface">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary">FAQ</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-poppins">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Quick answers to common questions about SupportFlow
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
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
                      <p className="px-5 pb-5 text-sm text-muted-foreground">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-muted-foreground mb-4">
              Still have questions? We&apos;re here to help.
            </p>
            <Link href="#">
              <Button variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" />
                Start Live Chat
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Emergency Support */}
      <section className="py-16 md:py-24 bg-secondary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-poppins">
              Need Immediate Help?
            </h2>
            <p className="mt-4 text-lg text-white/80">
              For urgent issues, our support team is available 24/7 for Enterprise customers.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="tel:+15551234567">
                <Button size="lg" className="bg-white text-secondary hover:bg-white/90">
                  <Phone className="mr-2 h-4 w-4" />
                  Emergency Support
                </Button>
              </Link>
              <Link href="mailto:support@supportflow.com">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Mail className="mr-2 h-4 w-4" />
                  Email Support
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-poppins">
            Ready to Get Started?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Start your free trial today and see how SupportFlow can transform 
            your customer support operations.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/pricing">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/features">
              <Button size="lg" variant="outline">
                Explore Features
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
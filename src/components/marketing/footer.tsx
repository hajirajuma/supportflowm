'use client'

import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Send, AtSign, Mail, Globe, Rss } from 'lucide-react'

const footerLinks = {
  product: {
    title: 'Product',
    links: [
      { label: 'Features', href: '/features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Help Center', href: '/help' },
      { label: 'Documentation', href: '/docs' },
    ],
  },
  company: {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  legal: {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Security', href: '/security' },
    ],
  },
}

const socialLinks = [
  { icon: Globe, href: '#' },
  { icon: Mail, href: '#' },
  { icon: AtSign, href: '#' },
  { icon: Rss, href: '#' },
]

export function Footer() {
  return (
    <footer className="bg-secondary text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">SF</span>
              </div>
              <span className="text-xl font-bold">SupportFlow</span>
            </Link>
            <p className="text-sm text-white/70 max-w-xs">
              The all-in-one customer support platform for modern businesses.
              Delight your customers with exceptional support.
            </p>
            <div className="mt-4 flex gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon
                return (
                  <a
                    key={index}
                    href={social.href}
                    className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
                    aria-label={`Visit our ${Icon.name} page`}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Links */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
            <div>
              <h3 className="font-semibold">Subscribe to our newsletter</h3>
              <p className="text-sm text-white/70">
                Get the latest updates and product news
              </p>
            </div>
            <div className="flex w-full max-w-md gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
              <Button className="bg-primary hover:bg-primary/90 whitespace-nowrap">
                <Send className="h-4 w-4 mr-2" />
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-white/60">
          <p>© {new Date().getFullYear()} SupportFlow. All rights reserved. Built by Infi-Tech.</p>
        </div>
      </div>
    </footer>
  )
}
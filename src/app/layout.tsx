import type { Metadata } from 'next'
import { Poppins, Inter } from 'next/font/google'
import { Providers } from '@/providers'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'SupportFlow',
    template: '%s | SupportFlow',
  },
  description: 'Multi-Tenant Client Feedback & Support Portal',
  keywords: ['support', 'feedback', 'ticketing', 'saas', 'multi-tenant'],
  authors: [{ name: 'SupportFlow Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://supportflow.com',
    title: 'SupportFlow',
    description: 'Multi-Tenant Client Feedback & Support Portal',
    siteName: 'SupportFlow',
    images: [
      {
        url: 'https://supportflow.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SupportFlow',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SupportFlow',
    description: 'Multi-Tenant Client Feedback & Support Portal',
    images: ['https://supportflow.com/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} ${inter.variable} font-inter antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
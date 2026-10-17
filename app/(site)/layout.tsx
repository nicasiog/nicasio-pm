import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { MotionProvider } from '@/components/motion/MotionProvider'
import { ogImageUrl } from '@/sanity/lib/image'
import { sanityFetch } from '@/sanity/lib/fetch'
import { siteSettingsQuery } from '@/sanity/lib/queries'
import type { SiteSettings } from '@/sanity/lib/types'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

const fallbackSettings: SiteSettings = {
  name: 'Portfolio',
  monogram: 'PM',
  role: 'Product Manager',
  email: 'hello@example.com',
}

async function getSettings() {
  const settings = await sanityFetch<SiteSettings | null>({ query: siteSettingsQuery, tags: ['siteSettings'] })
  return settings ?? fallbackSettings
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const og = ogImageUrl(settings.ogImage)
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${settings.name} · ${settings.role}`,
      template: `%s | ${settings.name}`,
    },
    description: settings.metaDescription ?? undefined,
    openGraph: {
      type: 'website',
      siteName: settings.name,
      title: `${settings.name} · ${settings.role}`,
      description: settings.metaDescription ?? undefined,
      images: og ? [{ url: og, width: 1200, height: 630, alt: settings.ogImage?.alt ?? settings.name }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${settings.name} · ${settings.role}`,
      description: settings.metaDescription ?? undefined,
      images: og ? [og] : undefined,
    },
  }
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()

  return (
    <div className={`${plusJakarta.variable} ${inter.variable} ${spaceGrotesk.variable} flex min-h-screen flex-col font-body`}>
      {/* Without JavaScript, Motion's initial opacity:0 would hide revealed sections. */}
      <noscript>
        <style>{`[data-reveal]{opacity:1 !important;transform:none !important}`}</style>
      </noscript>
      <a href="#main-content" className="sr-only-focusable">
        Skip to main content
      </a>
      <MotionProvider>
        <Header settings={settings} />
        <main id="main-content" className="flex-1 pt-[72px]">
          {children}
        </main>
        <Footer settings={settings} />
      </MotionProvider>
    </div>
  )
}

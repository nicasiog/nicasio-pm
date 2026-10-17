import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Sanity's CDN does the resizing and format negotiation; the custom loader
    // builds those URLs so nothing is routed through /_next/image.
    loader: 'custom',
    loaderFile: './sanity/lib/imageLoader.ts',
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
  },
}

export default nextConfig

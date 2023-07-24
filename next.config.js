/** @type {import('next').NextConfig} */
const { i18n, COUNTRY } = require('./next-i18next.config')
const path = require('path')

const nextConfig = {
  async headers() {
    return [
      {
        source: '/:all*(woff2|woff|eot|ttf)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, immutable',
          },
        ],
      },
      {
        source: '/:all*(svg|jpg|png|json)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, immutable',
          },
        ],
      },
    ]
  },
  i18n,
  reactStrictMode: false,
  swcMinify: true,
  experimental: { optimizeCss: true },
  env: {
    LOCALE: process.env.LOCALE || COUNTRY.vietnam,
  },
  poweredByHeader: false,
  trailingSlash: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'src', 'styles')],
  },
}

module.exports = nextConfig

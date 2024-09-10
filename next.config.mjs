/** @type {import('next').NextConfig} */

const cspHeader = `
    default-src 'self'  https://api.hubspot.com
    https://forms.hscollectedforms.net
    https://app.hubspot.com;

    script-src 'self' 'unsafe-eval' 'unsafe-inline'
    https://js.hs-scripts.com
    https://js.usemessages.com
    https://js.hs-banner.com
    https://js.hs-analytics.net
    https://js.hscollectedforms.net
    https://api.hubspot.com
    https://udbaa.com;

    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:  https://forms.hsforms.com;
    font-src 'self' data:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
    `

const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ''),
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: "browsing-topics=(), camera=(), geolocation=(); microphone=()",
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          }
        ]
      },


    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's.yimg.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '**',
      }
    ],
  },
};

export default nextConfig;


/** @type {import('next').NextConfig} */

// import {nrExternals} from '@newrelic/next/load-externals.js'

const nextConfig = {
  output: 'standalone',
  reactStrictMode: false,
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
  // staticPageGenerationTimeout: 600,
  // experimental: {
  //   // Without this setting, the Next.js compilation step will routinely
  //   // try to import files such as `LICENSE` from the `newrelic` module.
  //   // See https://nextjs.org/docs/app/api-reference/next-config-js/serverComponentsExternalPackages.
  //   serverComponentsExternalPackages: ['newrelic']
  // },

  // // In order for newrelic to effectively instrument a Next.js application,
  // // the modules that newrelic supports should not be mangled by webpack. Thus,
  // // we need to "externalize" all of the modules that newrelic supports.
  // webpack: (config) => {
  //   nrExternals(config)
  //   return config
  // }
};

export default nextConfig;


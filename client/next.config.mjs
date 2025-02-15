
import createNextIntlPlugin from 'next-intl/plugin';

/** @type {import('next').NextConfig} */

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
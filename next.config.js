// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'amora-guide-images-staging.s3.us-east-1.amazonaws.com',
        port: '',
        pathname: '/thumbnails/**',
      },
    ],
  },
  async headers() {
    return [
      {
        // Aplicar headers para forçar abertura externa no WhatsApp
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'none';",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

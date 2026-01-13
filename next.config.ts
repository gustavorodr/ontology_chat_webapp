import type { NextConfig } from 'next';
import { getServerEnv } from './src/config/env';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    const posthogHost = process.env.POSTHOG_HOST;
    const frontendHost = process.env.FRONTEND_URL || 'http://localhost:1081';
    return [
      {
        source: '/pages/create-group',
        destination: `${frontendHost}/pages/create-group`,
      },
      {
        source: '/pages/create-group/:path*',
        destination: `${frontendHost}/pages/create-group`,
      },
      {
        source: '/group',
        destination: `${frontendHost}/pages/group`,
      },
      {
        source: '/page/group',
        destination: `${frontendHost}/pages/group`,
      },
      {
        source: '/pages/group',
        destination: `${frontendHost}/pages/group`,
      },
      {
        source: '/add-property-manually',
        destination: `${frontendHost}/pages/add-property-manually`,
      },
      {
        source: '/add-property-by-link',
        destination: `${frontendHost}/pages/add-property-by-link`,
      },
      {
        source: '/page/add-property-by-link',
        destination: `${frontendHost}/pages/add-property-by-link`,
      },
      {
        source: '/pages/add-property-by-link',
        destination: `${frontendHost}/pages/add-property-by-link`,
      },
      {
        source: '/page/add-property-manually',
        destination: `${frontendHost}/pages/add-property-manually`,
      },
      {
        source: '/pages/add-property-manually',
        destination: `${frontendHost}/pages/add-property-manually`,
      },
      {
        source: '/add-property-manually',
        destination: `${frontendHost}/pages/add-property-manually`,
      },
      {
        source: '/page/add-property-manually',
        destination: `${frontendHost}/pages/add-property-manually`,
      },
      {
        source: '/pages/add-property-manually',
        destination: `${frontendHost}/pages/add-property-manually`,
      },
      {
        source: '/add-property-by-link',
        destination: `${frontendHost}/pages/add-property-by-link`,
      },
      {
        source: '/page/add-property-by-link',
        destination: `${frontendHost}/pages/add-property-by-link`,
      },
      {
        source: '/pages/add-property-by-link',
        destination: `${frontendHost}/pages/add-property-by-link`,
      },
      {
        source: '/compare',
        destination: `${frontendHost}/pages/compare`,
      },
      {
        source: '/filter',
        destination: `${frontendHost}/pages/filter`,
      },
      {
        source: '/users',
        destination: `${frontendHost}/pages/users`,
      },
      {
        source: '/page/users',
        destination: `${frontendHost}/pages/users`,
      },
      {
        source: '/pages/users',
        destination: `${frontendHost}/pages/users`,
      },
      {
        source: '/page/filter',
        destination: `${frontendHost}/pages/filter`,
      },
      {
        source: '/pages/filter',
        destination: `${frontendHost}/pages/filter`,
      },
      {
        source: '/page/compare',
        destination: `${frontendHost}/pages/compare`,
      },
      {
        source: '/pages/compare',
        destination: `${frontendHost}/pages/compare`,
      },
      {
        source: '/filter',
        destination: `${frontendHost}/pages/filter`,
      },
      {
        source: '/page/filter',
        destination: `${frontendHost}/pages/filter`,
      },
      {
        source: '/pages/filter',
        destination: `${frontendHost}/pages/filter`,
      },
      {
        source: '/users',
        destination: `${frontendHost}/pages/users`,
      },
      {
        source: '/page/users',
        destination: `${frontendHost}/pages/users`,
      },
      {
        source: '/pages/users',
        destination: `${frontendHost}/pages/users`,
      },
      {
        source: '/login',
        destination: `${frontendHost}/pages/login`,
      },
      {
        source: '/page/login',
        destination: `${frontendHost}/pages/login`,
      },
      {
        source: '/pages/login',
        destination: `${frontendHost}/pages/login`,
      },
      {
        source: '/login-otp',
        destination: `${frontendHost}/pages/login-otp`,
      },
      {
        source: '/my-properties',
        destination: `${frontendHost}/pages/my-properties`,
      },
      {
        source: '/page/my-properties',
        destination: `${frontendHost}/pages/my-properties`,
      },
      {
        source: '/pages/my-properties',
        destination: `${frontendHost}/pages/my-properties`,
      },
      {
        source: '/page/login-otp',
        destination: `${frontendHost}/pages/login-otp`,
      },
      {
        source: '/pages/login-otp',
        destination: `${frontendHost}/pages/login-otp`,
      },
      {
        source: '/my-properties',
        destination: `${frontendHost}/pages/my-properties`,
      },
      {
        source: '/page/my-properties',
        destination: `${frontendHost}/pages/my-properties`,
      },
      {
        source: '/pages/my-properties',
        destination: `${frontendHost}/pages/my-properties`,
      },
      {
        source: '/ingest/:path*',
        destination: `${posthogHost}/:path*`,
      },
      {
        source: '/listings',
        destination: `${frontendHost}/listings`,
      },
      {
        source: '/api/chat/message',
        destination: `${frontendHost}/chat/message`,
      },
      {
        source: '/pages/group',
        destination: `${frontendHost}/pages/group`,
      },
      {
        source: '/api/groups',
        destination: `${frontendHost}/groups`,
      },
      {
        source: '/api/group/:groupId/users',
        destination: `${frontendHost}/group/:groupId/users`,
      },
      {
        source: '/api/group/:groupId/listings',
        destination: `${frontendHost}/group/:groupId/listings`,
      },
    ];
  },
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;

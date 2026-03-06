import { defineConfig } from 'next/config';

const nextConfig = defineConfig({
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_AUTH0_DOMAIN: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
    NEXT_PUBLIC_AUTH0_CLIENT_ID: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  },
  images: {
    domains: ['example.com'], // update with your image domains as needed
  },
  server: {
    // Custom server settings if needed
  },
});

export default nextConfig;
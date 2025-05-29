/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: [
      'https://rfrjimdiwfjqhhzjcqbn.supabase.co',
      'your-s3-bucket.s3.amazonaws.com',
    ],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

module.exports = nextConfig

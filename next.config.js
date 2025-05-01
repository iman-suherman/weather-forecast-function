/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  // Add basePath for Cloud Functions
  basePath: '/weather-forecast',
  // Ensure static assets are properly handled
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
  // Ensure trailing slashes are handled correctly
  trailingSlash: true,
}

module.exports = nextConfig; 
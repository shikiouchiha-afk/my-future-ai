const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // keeps things stable for App Router projects
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },

  // helps avoid weird build issues during dev
  typescript: {
    ignoreBuildErrors: false,
  },

  eslint: {
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  experimental: {
    globalNotFound: true,
  },
};

module.exports = nextConfig;
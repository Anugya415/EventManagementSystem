/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: false,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
};

export default nextConfig;

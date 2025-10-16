/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: false,
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

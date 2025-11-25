import type { NextConfig } from "next";

const nextConfig: NextConfig = {


  /* config options here */
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.module.rules.push({
      test: /\.yaml$/,
      use: 'yaml-loader',
    });
    return config;
  },
};

export default nextConfig;

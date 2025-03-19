/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // domains: ["https://smcore.blob.core.windows.net"],
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imgs.search.brave.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "smcore.blob.core.windows.net",
        port: "",
        pathname: "/**",
      },
    ],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;

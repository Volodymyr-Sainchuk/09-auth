import { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["ac.goit.global"], // додай сюди всі зовнішні домени для <Image>
  },
};

export default nextConfig;

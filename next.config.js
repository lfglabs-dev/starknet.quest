/** @type {import('next').NextConfig} */
const { withAxiom } = require("next-axiom");

module.exports = module.exports = withAxiom({
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  },
  images: {
    domains: [
      "www.starknet.id",
      "starknet.id",
      "app.starknet.id",
      "starknetid.netlify.app",
      "gateway.pinata.cloud",
      "api.briq.construction",
      "cdn.starknet.quest",
      "goerli.cdn.starknet.quest",
      "sepolia.cdn.starknet.quest",
    ],
  },
});

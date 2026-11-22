/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    agentUpgrade: "security",
  },
  i18n: {
    locales: ["pt-BR", "en"],
    defaultLocale: "pt-BR",
  },
}

module.exports = nextConfig

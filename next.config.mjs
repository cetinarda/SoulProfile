/** @type {import('next').NextConfig} */
const buildTarget = process.env.BUILD_TARGET ?? 'web';
const isCapacitor = buildTarget === 'capacitor';

const nextConfig = {
  reactStrictMode: true,
  // Capacitor iOS için statik export — Apple guideline 4.0 wrapper rejection riskini
  // azaltmak için tüm sayfalar gemiyle birlikte gelir; runtime fetch yok.
  ...(isCapacitor && {
    output: 'export',
    trailingSlash: true,
    images: { unoptimized: true },
    skipTrailingSlashRedirect: true,
  }),
  ...(!isCapacitor && {
    images: {
      remotePatterns: [
        { protocol: 'https', hostname: '**' },
      ],
    },
  }),
};

export default nextConfig;

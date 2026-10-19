/** @type {import('next').NextConfig} */
const nextConfig = {
  // Workspace packages are TypeScript source: Next compiles them.
  transpilePackages: ["@lumen/analytics", "@lumen/calls", "@lumen/config", "@lumen/db", "@lumen/legal", "@lumen/payments", "@lumen/generate"],
  poweredByHeader: false,
  reactStrictMode: true,
  // The repository root holds the lockfile and docs; tell Next where the monorepo starts.
  outputFileTracingRoot: new URL("../..", import.meta.url).pathname,
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: true },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Microphone only on our own pages (the web call page asks for it).
          { key: "Permissions-Policy", value: "microphone=(self), camera=(), geolocation=()" },
        ],
      },
    ];
  },
};
export default nextConfig;

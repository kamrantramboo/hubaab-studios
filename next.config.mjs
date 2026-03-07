/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/studio',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Supabase Storage 의 public URL 도메인 패턴.
    // 형식: https://<project-ref>.supabase.co/storage/v1/object/public/<bucket>/<path>
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["isomorphic-dompurify", "jsdom"],
  },
  images: {
    // Vercel Image Optimization 한도/플랜 이슈 시 402로 전체 next/image 가 깨짐.
    // 배너·강사·시간표 등은 Supabase public URL 또는 /public 정적 파일을 그대로 제공.
    unoptimized: true,
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

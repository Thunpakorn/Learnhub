declare const process: any;

const nextConfig = {
  // ปิด standalone เมื่ออยู่บน Vercel
  output: process.env.VERCEL ? undefined : "standalone",
};

export default nextConfig;
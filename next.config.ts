/** @type {import('next').NextConfig} */
const nextConfig = {
  // เปิด standalone เฉพาะเมื่อรันผ่าน Docker หรือไม่ได้อยู่บน Vercel
  output: process.env.DOCKER_BUILD === 'true' ? 'standalone' : undefined,
};

module.exports = nextConfig;
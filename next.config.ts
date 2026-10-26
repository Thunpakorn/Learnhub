/** @type {import('next').NextConfig} */
const nextConfig = {
  // ถ้าอยู่บน Vercel ให้เป็น undefined (ให้ Vercel จัดการเอง)
  // ถ้าไม่ใช่ (เช่น ตอนรัน docker build) ให้เปิด 'standalone'
  output: process.env.VERCEL ? undefined : 'standalone',
};

module.exports = nextConfig;
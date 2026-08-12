import { redirect } from "next/navigation";

/**
 * หน้า Home (src/app/page.tsx)
 * ทำการ Redirect ไปยังหน้า Discovery Engine (/discovery) ตามที่ผู้ใช้ต้องการนำหน้าแรกออก
 */
export default function HomePage() {
  redirect("/login");
}

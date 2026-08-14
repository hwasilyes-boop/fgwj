import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const admin = await requireAdmin();
  if (!admin) {
    redirect("/login?redirect=/admin");
  }

  return <AdminShell adminName={admin.name}>{children}</AdminShell>;
}

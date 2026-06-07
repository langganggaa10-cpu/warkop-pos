import { prisma } from "@/lib/prisma";
import CashierClient from "./CashierClient";

export const dynamic = "force-dynamic";

export default async function CashierPage() {
  // 1. Ambil data meja aktif
  const tables = await prisma.table.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      number: "asc",
    },
  });

  // 2. Ambil data menu
  const menus = await prisma.menu.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <CashierClient 
      initialMenus={menus} 
      initialTables={tables} 
    />
  );
}

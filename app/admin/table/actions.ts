"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTable(formData: FormData) {
  const number = Number(formData.get("number"));
  const isActive = formData.get("isActive") === "on";

  await prisma.table.create({
    data: {
      number,
      isActive,
    },
  });

  revalidatePath("/admin/table");
}

export async function clearTableStatus(id: number) {
  await prisma.$executeRaw`UPDATE \`Table\` SET isOccupied = 0 WHERE id = ${id}`;
  revalidatePath("/admin/table");
  revalidatePath("/dashboard/kasir");
}

export async function updateTable(formData: FormData) {
  const id = Number(formData.get("id"));
  const number = Number(formData.get("number"));
  const isActive = formData.get("isActive") === "on";

  await prisma.table.update({
    where: { id },
    data: {
      number,
      isActive,
    },
  });

  revalidatePath("/admin/table");
  redirect("/admin/table");
}

export async function deleteTable(id: number) {
  await prisma.table.delete({
    where: { id },
  });

  revalidatePath("/admin/table");
}

export async function toggleTableStatus(id: number, currentStatus: boolean) {
  await prisma.table.update({
    where: { id },
    data: {
      isActive: !currentStatus,
    },
  });

  revalidatePath("/admin/table");
}

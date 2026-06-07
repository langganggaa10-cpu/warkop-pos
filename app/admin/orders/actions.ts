"use server";

import { prisma } from "@/lib/prisma";
import type { OrderStatus } from "@/types/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateOrderStatusAction(
  formData: FormData
): Promise<void> {
  const id = Number(formData.get("id"));
  const status = formData.get("status") as OrderStatus;

  try {
    await prisma.order.update({
      where: { id },
      data: { status },
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${id}`);
  } catch (error) {
    console.error("Update Status Error:", error);
    throw new Error("Gagal memperbarui status pesanan");
  }

  redirect(`/admin/orders/${id}`);
}
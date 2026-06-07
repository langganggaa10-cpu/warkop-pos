"use server";

import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateOrderStatusAction(formData: FormData) {
  const id = Number(formData.get("id"));
  const status = formData.get("status") as OrderStatus;

  try {
    await prisma.order.update({
      where: { id },
      data: { status },
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${id}`);
  } catch (error: any) {
    console.error("Update Status Error:", error);
    return { error: "Gagal memperbarui status pesanan" };
  }

  redirect(`/admin/orders/${id}`);
}

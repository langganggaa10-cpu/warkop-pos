"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function processPaymentAction(data: {
  orderId: number;
  total: number;
  paidAmount: number;
  change: number;
  method: string;
  redirectPath?: string;
}) {
  try {
    await prisma.$transaction(async (tx) => {
      // 1. Simpan data pembayaran
      await tx.payment.create({
        data: {
          orderId: data.orderId,
          total: data.total,
          paidAmount: data.paidAmount,
          change: data.change,
          method: data.method,
        },
      });

      // 2. Update status Order menjadi COMPLETED
      await tx.order.update({
        where: { id: data.orderId },
        data: { status: "COMPLETED" },
      });
    });

    revalidatePath("/admin/orders");
    revalidatePath("/dashboard/kasir/orders");
    revalidatePath("/");
  } catch (error: any) {
    console.error("Payment Error:", error);
    return { error: "Gagal memproses pembayaran" };
  }

  if (data.redirectPath) {
    redirect(data.redirectPath);
  } else {
    redirect(`/admin/payment/${data.orderId}/success`);
  }
}

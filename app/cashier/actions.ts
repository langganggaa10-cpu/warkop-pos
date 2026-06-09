"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type OrderItemInput = {
  menuId: number;
  quantity: number;
  price: number;
};

export async function saveOrder(tableId: number, items: OrderItemInput[], total: number) {
  try {
    await prisma.$transaction(async (tx) => {
      // 1. Buat Order
      const order = await tx.order.create({
        data: {
          tableId: tableId,
          total: total,
          status: "PENDING",
        },
      });

      // 2. Buat OrderItems menggunakan model orderitem (lowercase)
      await (tx as any).orderitem.createMany({
        data: items.map((item) => ({
          orderId: order.id,
          menuId: item.menuId,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      // 3. Update Stok Menu
      for (const item of items) {
        await tx.menu.update({
          where: { id: item.menuId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }
    });

    revalidatePath("/cashier");
    return { success: true };
  } catch (error: any) {
    console.error("Save Order Error:", error);
    return { success: false, error: error.message || "Gagal menyimpan pesanan" };
  }
}

"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

export async function processCheckout(
  tableId: number,
  items: CartItem[],
  total: number
) {
  try {
    // Gunakan transaksi untuk memastikan semua operasi berhasil atau gagal bersamaan
    await prisma.$transaction(async (tx) => {
      // 0. Tandai meja sebagai terisi menggunakan Prisma Client API
      await tx.table.update({
        where: { id: tableId },
        data: { isOccupied: true }
      });

      // 1. Buat Order
      const order = await tx.order.create({
        data: {
          tableId: tableId,
          total: total,
          status: "PENDING",
        },
      });

      // 2. Buat OrderItems dan Kurangi Stok
      for (const item of items) {
        // Buat detail item pesanan menggunakan model orderitem (lowercase)
        await tx.orderitem.create({
          data: {
            orderId: order.id,
            menuId: item.id,
            quantity: item.quantity,
            price: item.price,
          },
        });

        // Update stok menu
        const menu = await tx.menu.findUnique({
          where: { id: item.id },
        });

        if (!menu || menu.stock < item.quantity) {
          throw new Error(`Stok menu ${item.name} tidak mencukupi`);
        }

        await tx.menu.update({
          where: { id: item.id },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }
    });

    revalidatePath("/dashboard/kasir");
    revalidatePath("/admin/menu");
    return { success: true };
  } catch (error: any) {
    console.error("Checkout Error:", error);
    return { success: false, error: error.message || "Gagal memproses pesanan" };
  }
}

export async function clearTable(tableId: number) {
  try {
    await prisma.table.update({
      where: { id: tableId },
      data: { isOccupied: false }
    });
    revalidatePath("/dashboard/kasir");
    revalidatePath("/admin/table");
    return { success: true };
  } catch (error: any) {
    console.error("Clear Table Error:", error);
    return { success: false, error: error.message || "Gagal mengosongkan meja" };
  }
}

"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createMenu(formData: FormData) {
  const name = formData.get("name") as string;
  const price = Number(formData.get("price"));
  const category = formData.get("category") as string;
  const stock = Number(formData.get("stock"));

  await prisma.menu.create({
    data: {
      name,
      price,
      category,
      stock,
    },
  });

  revalidatePath("/admin/menu");
}

export async function updateMenu(
  formData: FormData
) {
  const id = Number(formData.get("id"));

  await prisma.menu.update({
    where: { id },
    data: {
      name: formData.get("name") as string,
      price: Number(formData.get("price")),
      category: formData.get("category") as string,
      stock: Number(formData.get("stock")),
    },
  });

  revalidatePath("/admin/menu");

  redirect("/admin/menu");
}

export async function deleteMenu(id: number) {
  await prisma.menu.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin/menu");
  redirect("/admin/menu");
}
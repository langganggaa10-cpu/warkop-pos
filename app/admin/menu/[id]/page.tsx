import { prisma } from "@/lib/prisma";
import { updateMenu } from "../actions";
import DeleteButton from "../DeleteButton";
import Link from "next/link";

export default async function EditMenuPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const menu = await prisma.menu.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!menu) {
    return (
      <div className="p-10">
        Menu tidak ditemukan
      </div>
    );
  }

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        Edit Menu: {menu.name}
      </h1>

      <form
        action={updateMenu}
        className="space-y-6 max-w-md bg-white p-6 rounded shadow border"
      >
        <input
          type="hidden"
          name="id"
          value={menu.id}
        />

        <div>
          <label className="block text-sm font-bold mb-1 text-gray-700">Nama Menu</label>
          <input
            name="name"
            defaultValue={menu.name}
            className="border p-2 w-full rounded bg-gray-50"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1 text-gray-700">Harga (Rp)</label>
          <input
            name="price"
            type="number"
            defaultValue={menu.price}
            className="border p-2 w-full rounded bg-gray-50"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1 text-gray-700">Kategori</label>
          <input
            name="category"
            defaultValue={menu.category}
            className="border p-2 w-full rounded bg-gray-50"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-1 text-gray-700">Stok</label>
          <input
            name="stock"
            type="number"
            defaultValue={menu.stock}
            className="border p-2 w-full rounded bg-gray-50"
            required
          />
        </div>

        <div className="flex gap-2 pt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded font-bold"
          >
            Update Menu
          </button>

          <DeleteButton 
            id={menu.id} 
            className="bg-red-600 text-white px-6 py-2 rounded font-bold"
          />

          <Link 
            href="/admin/menu"
            className="bg-gray-500 text-white px-6 py-2 rounded font-bold text-center"
            style={{ textDecoration: 'none' }}
          >
            Batal
          </Link>
        </div>
      </form>
    </main>
  );
}
import { prisma } from "@/lib/prisma";
import { updateTable } from "../actions";
import DeleteTableButton from "../DeleteTableButton";
import Link from "next/link";

export default async function EditTablePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const table = await prisma.table.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!table) {
    return (
      <div className="p-10">
        Meja tidak ditemukan
      </div>
    );
  }

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        Edit Meja {table.number}
      </h1>

      <form
        action={updateTable}
        className="space-y-6 max-w-md bg-white p-6 rounded shadow border"
      >
        <input
          type="hidden"
          name="id"
          value={table.id}
        />

        <div>
          <label className="block text-sm font-bold mb-1">Nomor Meja</label>
          <input
            name="number"
            type="number"
            defaultValue={table.number}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            name="isActive"
            type="checkbox"
            id="isActive"
            defaultChecked={table.isActive}
            className="w-5 h-5"
          />
          <label htmlFor="isActive" className="font-bold">Aktif</label>
        </div>

        <div className="flex gap-2 pt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded font-bold"
          >
            Update Meja
          </button>

          <DeleteTableButton id={table.id} />
          
          <Link 
            href="/admin/table"
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

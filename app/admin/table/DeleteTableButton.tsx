"use client";

import { deleteTable } from "./actions";

export default function DeleteTableButton({ id }: { id: number }) {
  const handleDelete = async () => {
    if (confirm("Apakah Anda yakin ingin menghapus meja ini?")) {
      await deleteTable(id);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="text-white px-3 py-1 rounded text-sm"
      style={{
        backgroundColor: '#dc2626',
        color: 'white',
        padding: '4px 12px',
        borderRadius: '4px',
        border: 'none',
        cursor: 'pointer'
      }}
    >
      Hapus
    </button>
  );
}

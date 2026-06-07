"use client";

import { deleteMenu } from "./actions";
import { Trash2 } from "lucide-react";

export default function DeleteButton({ id, className }: { id: number, className?: string }) {
  const handleDelete = async () => {
    const ok = confirm("Apakah Anda yakin ingin menghapus menu ini?");
    if (ok) {
      await deleteMenu(id);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      style={{ 
        width: '44px', 
        height: '44px', 
        backgroundColor: '#FEF2F2', 
        color: '#EF4444', 
        borderRadius: '14px', 
        border: 'none', 
        cursor: 'pointer', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        boxShadow: '0 4px 10px rgba(239, 68, 68, 0.1)',
        transition: 'all 0.2s'
      }}
    >
      <Trash2 size={20} />
    </button>
  );
}

"use client";

import { clearTableStatus } from "./actions";
import { Eraser } from "lucide-react";
import { useState } from "react";

export default function ClearTableButton({ id, isOccupied }: { id: number, isOccupied: boolean }) {
  const [isPending, setIsPending] = useState(false);

  if (!isOccupied) return null;

  const handleClear = async () => {
    if (confirm("Kosongkan status meja ini secara manual?")) {
      setIsPending(true);
      await clearTableStatus(id);
      setIsPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClear}
      disabled={isPending}
      style={{
        padding: '12px',
        backgroundColor: '#FEF2F2',
        border: '1px solid #FEE2E2',
        borderRadius: '14px',
        color: '#EF4444',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontSize: '12px',
        fontWeight: 800,
        cursor: isPending ? 'not-allowed' : 'pointer',
        flex: 1
      }}
    >
      <Eraser size={16} />
      {isPending ? "Proses..." : "Kosongkan"}
    </button>
  );
}

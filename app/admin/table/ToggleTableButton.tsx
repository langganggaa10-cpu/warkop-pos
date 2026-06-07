"use client";

import { toggleTableStatus } from "./actions";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";

export default function ToggleTableButton({ id, isActive }: { id: number, isActive: boolean }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleTableStatus(id, isActive);
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '6px', 
        padding: '6px 12px', 
        borderRadius: '10px', 
        fontSize: '10px', 
        fontWeight: 800, 
        backgroundColor: isPending ? '#F8FAFC' : isActive ? '#F0FDF4' : '#FEF2F2', 
        color: isPending ? '#94A3B8' : isActive ? '#15803D' : '#B91C1C',
        border: `1px solid ${isPending ? '#F1F5F9' : isActive ? '#DCFCE7' : '#FEE2E2'}`,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        cursor: isPending ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s'
      }}
    >
      {isPending ? (
        <Loader2 size={12} className="animate-spin" />
      ) : isActive ? (
        <CheckCircle2 size={12} />
      ) : (
        <XCircle size={12} />
      )}
      {isPending ? 'Memproses...' : isActive ? 'Aktif' : 'Nonaktif'}
    </button>
  );
}

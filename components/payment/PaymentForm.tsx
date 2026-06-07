"use client";

import { useState, useMemo } from "react";
import { processPaymentAction } from "@/app/admin/payment/actions";

interface PaymentFormProps {
  orderId: number;
  grandTotal: number;
  redirectPath?: string;
}

export default function PaymentForm({ orderId, grandTotal, redirectPath }: PaymentFormProps) {
  const [method, setMethod] = useState("Cash");
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const change = useMemo(() => {
    return paidAmount - grandTotal;
  }, [paidAmount, grandTotal]);

  const isInsufficient = paidAmount < grandTotal;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isInsufficient) return;

    setIsSubmitting(true);
    const result = await processPaymentAction({
      orderId,
      total: grandTotal,
      paidAmount,
      change,
      method,
      redirectPath,
    });
    
    if (result?.error) {
      alert(result.error);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ backgroundColor: '#FFFFFF', padding: '40px', borderRadius: '48px', border: '1px solid #F1F5F9', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '48px', height: '48px', backgroundColor: '#F0FDF4', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16A34A' }}>
          <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A', margin: 0 }}>Form Pembayaran</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* METODE PEMBAYARAN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginLeft: '4px' }}>METODE PEMBAYARAN</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            {["Cash", "QRIS", "Transfer"].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMethod(m)}
                style={{
                  padding: '14px',
                  borderRadius: '16px',
                  fontSize: '13px',
                  fontWeight: 800,
                  transition: 'all 0.2s',
                  border: '1px solid #F1F5F9',
                  cursor: 'pointer',
                  backgroundColor: method === m ? '#0F172A' : '#F8FAFC',
                  color: method === m ? '#FFFFFF' : '#64748B'
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* NOMINAL DIBAYAR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginLeft: '4px' }}>NOMINAL DIBAYAR (RP)</label>
          <div style={{ position: 'relative' }}>
            <input
              type="number"
              value={paidAmount || ""}
              onChange={(e) => setPaidAmount(Number(e.target.value))}
              placeholder="0"
              style={{ 
                width: '100%', 
                backgroundColor: '#F8FAFC', 
                border: '1px solid #F1F5F9', 
                borderRadius: '20px', 
                padding: '20px', 
                fontSize: '24px', 
                fontWeight: 900, 
                color: '#0F172A',
                outline: 'none'
              }}
              required
            />
          </div>
        </div>

        {/* INFO KEMBALIAN */}
        <div style={{ padding: '24px', borderRadius: '24px', backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#64748B' }}>Kembalian</span>
            <span style={{ fontSize: '24px', fontWeight: 900, color: change < 0 ? '#EF4444' : '#16A34A' }}>
              Rp {Math.max(0, change).toLocaleString("id-ID")}
            </span>
          </div>

          {isInsufficient && paidAmount > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#EF4444', fontSize: '12px', fontWeight: 800 }}>
              <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              NOMINAL PEMBAYARAN KURANG
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || isInsufficient || paidAmount === 0}
        style={{ 
          width: '100%', 
          backgroundColor: isSubmitting || isInsufficient || paidAmount === 0 ? '#E2E8F0' : '#16A34A', 
          color: isSubmitting || isInsufficient || paidAmount === 0 ? '#94A3B8' : '#FFFFFF', 
          padding: '20px', 
          borderRadius: '24px', 
          border: 'none', 
          fontSize: '16px', 
          fontWeight: 900, 
          cursor: isSubmitting || isInsufficient || paidAmount === 0 ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          boxShadow: isSubmitting || isInsufficient || paidAmount === 0 ? 'none' : '0 10px 20px -5px rgba(22, 163, 74, 0.4)'
        }}
      >
        {isSubmitting ? "Memproses..." : "Selesaikan Pembayaran"}
      </button>
    </form>
  );
}

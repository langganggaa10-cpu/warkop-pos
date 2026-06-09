import { prisma } from "@/lib/prisma";
import Link from "next/link";
import PrintReceipt from "@/components/print/PrintReceipt";
import { CheckCircle2, Home, ClipboardList, Coffee } from "lucide-react";

export const dynamic = "force-dynamic";

interface SuccessPageProps {
  params: Promise<{ id: string }>;
}

export default async function PaymentSuccessPage({ params }: SuccessPageProps) {
  const { id } = await params;
  const orderId = Number(id);

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      table: true,
      orderitem: {
        include: {
          menu: true,
        },
      },
      payment: true,
    },
  });

  if (!order || !order.payment) {
    return <div style={{ textAlign: 'center', padding: '100px' }}>Data pembayaran tidak ditemukan.</div>;
  }

  const payment = order.payment;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9FAFB', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ backgroundColor: '#FFFFFF', padding: '48px', borderRadius: '40px', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)', textAlign: 'center', maxWidth: '500px', width: '100%', border: '1px solid #F1F5F9' }}>
        <div style={{ width: '80px', height: '80px', backgroundColor: '#F0FDF4', color: '#15803D', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
          <CheckCircle2 size={48} />
        </div>
        
        <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#0F172A', marginBottom: '8px' }}>Pembayaran Berhasil!</h1>
        <p style={{ color: '#64748B', fontWeight: 600, marginBottom: '32px' }}>Transaksi Order #{order.id} telah selesai diproses.</p>

        <div style={{ backgroundColor: '#F8FAFC', padding: '24px', borderRadius: '24px', marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#94A3B8', fontWeight: 700, fontSize: '13px' }}>TOTAL TAGIHAN</span>
            <span style={{ color: '#0F172A', fontWeight: 900 }}>Rp {Number(payment.total).toLocaleString("id-ID")}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#94A3B8', fontWeight: 700, fontSize: '13px' }}>DIBAYAR ({payment.method})</span>
            <span style={{ color: '#0F172A', fontWeight: 900 }}>Rp {Number(payment.paidAmount).toLocaleString("id-ID")}</span>
          </div>
          <div style={{ borderTop: '1px dashed #E2E8F0', marginTop: '8px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#15803D', fontWeight: 800, fontSize: '13px' }}>KEMBALIAN</span>
            <span style={{ color: '#15803D', fontWeight: 900, fontSize: '18px' }}>Rp {Number(payment.change).toLocaleString("id-ID")}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <PrintReceipt order={order} payment={payment} />
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Link 
              href="/dashboard/kasir" 
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', backgroundColor: '#0F172A', color: '#FFFFFF', fontWeight: 800, borderRadius: '16px', textDecoration: 'none' }}
            >
              <Home size={18} /> POS Kasir
            </Link>
            <Link 
              href="/dashboard/kasir/orders" 
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', backgroundColor: '#F1F5F9', color: '#475569', fontWeight: 800, borderRadius: '16px', textDecoration: 'none' }}
            >
              <ClipboardList size={18} /> Riwayat
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

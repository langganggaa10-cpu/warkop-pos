import { prisma } from "@/lib/prisma";
import Link from "next/link";
import PaymentForm from "@/components/payment/PaymentForm";
import { ChevronLeft, Coffee, LogOut, CreditCard } from "lucide-react";
import { logoutAction } from "@/app/auth/actions";

export const dynamic = "force-dynamic";

interface PaymentPageProps {
  params: Promise<{ id: string }>;
}

export default async function CashierPaymentPage({ params }: PaymentPageProps) {
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
    },
  });

  if (!order) {
    return <div style={{ textAlign: 'center', padding: '100px' }}>Pesanan tidak ditemukan.</div>;
  }

  const grandTotal = Number(order.total);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F9FAFB', fontFamily: 'Inter, sans-serif' }}>
      <header style={{ backgroundColor: '#0F172A', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 30 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', backgroundColor: '#FFC107', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Coffee style={{ color: '#0F172A', width: '22px', height: '22px' }} />
          </div>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 900, color: '#FFFFFF' }}>WARKOP<span style={{ color: '#FFC107' }}>POS</span></h1>
        </div>
        <nav style={{ display: 'flex', gap: '32px' }}>
          <Link href="/dashboard/kasir" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '14px', fontWeight: 700 }}>POS Kasir</Link>
          <Link href="/dashboard/kasir/orders" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '14px', fontWeight: 700 }}>Riwayat Pesanan</Link>
        </nav>
        <form action={logoutAction}><button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', borderRadius: '12px', fontSize: '13px', fontWeight: 800, border: '1px solid rgba(239, 68, 68, 0.2)', cursor: 'pointer' }}><LogOut size={18} /><span>Keluar</span></button></form>
      </header>

      <main style={{ flex: 1, padding: '40px', maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href={`/dashboard/kasir/orders/${order.id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '44px', height: '44px', backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #F1F5F9', color: '#64748B' }}><ChevronLeft size={20} /></Link>
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#0F172A', margin: 0 }}>Pembayaran Pesanan</h2>
            <p style={{ margin: 0, color: '#94A3B8', fontWeight: 600 }}>Order #{order.id} &bull; Meja {order.table.number}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 450px', gap: '40px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '32px', border: '1px solid #F1F5F9', overflow: 'hidden' }}>
              <div style={{ padding: '24px 32px', backgroundColor: '#F8FAFC', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 900, color: '#0F172A', textTransform: 'uppercase' }}>Rincian Tagihan</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#15803D', fontWeight: 800, fontSize: '14px' }}><CreditCard size={18} /> BELUM DIBAYAR</div>
              </div>
              <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {order.orderitem.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 800, color: '#0F172A' }}>{item.menu.name}</p>
                      <p style={{ margin: 0, fontSize: '12px', color: '#94A3B8', fontWeight: 600 }}>{item.quantity} x Rp {Number(item.price).toLocaleString("id-ID")}</p>
                    </div>
                    <span style={{ fontWeight: 800, color: '#0F172A' }}>Rp {(item.quantity * Number(item.price)).toLocaleString("id-ID")}</span>
                  </div>
                ))}
                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '2px dashed #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '16px', fontWeight: 800, color: '#64748B' }}>Total Tagihan</span>
                  <span style={{ fontSize: '32px', fontWeight: 900, color: '#0F172A' }}>Rp {grandTotal.toLocaleString("id-ID")}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <PaymentForm orderId={orderId} grandTotal={grandTotal} redirectPath={`/dashboard/kasir/payment/${orderId}/success`} />
          </div>
        </div>
      </main>
    </div>
  );
}

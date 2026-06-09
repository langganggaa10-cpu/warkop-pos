import { prisma } from "@/lib/prisma";
import Link from "next/link";
import PaymentForm from "@/components/payment/PaymentForm";

export const dynamic = "force-dynamic";

interface PaymentPageProps {
  params: Promise<{ id: string }>;
}

export default async function PaymentPage({ params }: PaymentPageProps) {
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-3xl shadow-xl border border-gray-100 max-w-sm w-full">
          <h1 className="text-xl font-black text-gray-800 mb-4">Pesanan tidak ditemukan</h1>
          <Link href="/admin/orders" className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold inline-block">Kembali ke Riwayat</Link>
        </div>
      </div>
    );
  }

  const totalItem = order.orderitem.reduce((sum, item) => sum + item.quantity, 0);
  const grandTotal = Number(order.total);
  const formattedDate = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(order.createdAt);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>Pembayaran Kasir</h2>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '8px' }}>
            <span style={{ fontSize: '15px', fontWeight: 600, color: '#64748B' }}>Order #{order.id}</span>
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#CBD5E1' }}></div>
            <span style={{ fontSize: '15px', fontWeight: 600, color: '#64748B' }}>Meja {order.table.number}</span>
          </div>
        </div>
        
        <Link 
          href="/admin/orders" 
          style={{ 
            backgroundColor: '#FFFFFF', 
            padding: '12px 24px', 
            borderRadius: '24px', 
            boxShadow: '0 4px 15px rgba(0,0,0,0.03)', 
            border: '1px solid #F1F5F9', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            textDecoration: 'none',
            color: '#64748B',
            fontSize: '14px',
            fontWeight: 800
          }}
        >
          <div style={{ 
            width: '32px', 
            height: '32px', 
            backgroundColor: '#F8FAFC', 
            borderRadius: '10px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#64748B'
          }}>
            <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </div>
          Kembali
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '40px' }}>
        {/* ORDER SUMMARY */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '48px', border: '1px solid #F1F5F9', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
            <div style={{ padding: '32px 40px', borderBottom: '1px solid #F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A', margin: 0 }}>Rincian Item</h3>
              <span style={{ backgroundColor: '#F1F5F9', color: '#64748B', padding: '6px 16px', borderRadius: '12px', fontSize: '12px', fontWeight: 900 }}>{totalItem} ITEMS</span>
            </div>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #F8FAFC' }}>
                  <th style={{ padding: '24px 40px', fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>NAMA MENU</th>
                  <th style={{ padding: '24px 40px', fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>HARGA</th>
                  <th style={{ padding: '24px 40px', fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>QTY</th>
                  <th style={{ padding: '24px 40px', fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'right' }}>SUBTOTAL</th>
                </tr>
              </thead>
              <tbody>
                {order.orderitem.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #F8FAFC' }}>
                    <td style={{ padding: '24px 40px' }}>
                      <span style={{ fontSize: '16px', fontWeight: 900, color: '#0F172A' }}>{item.menu.name}</span>
                    </td>
                    <td style={{ padding: '24px 40px', textAlign: 'center' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#64748B' }}>Rp {Number(item.price).toLocaleString("id-ID")}</span>
                    </td>
                    <td style={{ padding: '24px 40px', textAlign: 'center' }}>
                      <span style={{ fontSize: '14px', fontWeight: 900, color: '#0F172A' }}>{item.quantity}</span>
                    </td>
                    <td style={{ padding: '24px 40px', textAlign: 'right' }}>
                      <span style={{ fontSize: '16px', fontWeight: 900, color: '#0F172A' }}>Rp {(Number(item.price) * item.quantity).toLocaleString("id-ID")}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div style={{ padding: '40px', background: '#0F172A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>TOTAL PEMBAYARAN</span>
              <span style={{ fontSize: '32px', fontWeight: 900, color: '#FFC107' }}>Rp {grandTotal.toLocaleString("id-ID")}</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={{ backgroundColor: '#FFFFFF', padding: '32px', borderRadius: '32px', border: '1px solid #F1F5F9', boxShadow: '0 10px 20px rgba(0,0,0,0.02)' }}>
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '12px' }}>STATUS</label>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#FFF7ED', color: '#C2410C', borderRadius: '12px', fontSize: '14px', fontWeight: 900 }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#C2410C' }}></div>
                {order.status}
              </div>
            </div>
            <div style={{ backgroundColor: '#FFFFFF', padding: '32px', borderRadius: '32px', border: '1px solid #F1F5F9', boxShadow: '0 10px 20px rgba(0,0,0,0.02)' }}>
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '12px' }}>WAKTU PESANAN</label>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>{formattedDate}</div>
            </div>
          </div>
        </div>

        {/* PAYMENT FORM */}
        <div style={{ position: 'sticky', top: '48px', height: 'fit-content' }}>
          <PaymentForm orderId={orderId} grandTotal={grandTotal} />
        </div>
      </div>
    </div>
  );
}

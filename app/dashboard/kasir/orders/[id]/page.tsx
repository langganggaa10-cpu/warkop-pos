import { prisma } from "@/lib/prisma";
import type { OrderStatus } from "@/types/prisma";
import Link from "next/link";
import { updateOrderStatusAction } from "@/app/admin/orders/actions";
import { ChevronLeft, ClipboardList, Clock, MapPin, Package, CreditCard, RefreshCcw, CheckCircle2, XCircle, PlayCircle, Coffee, LogOut } from "lucide-react";
import { logoutAction } from "@/app/auth/actions";

export const dynamic = "force-dynamic";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CashierOrderDetailPage({ params }: OrderDetailPageProps) {
  const { id: orderIdStr } = await params;
  const orderId = Number(orderIdStr);

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      table: true,
      items: {
        include: {
          menu: true,
        },
      },
    },
  });

  if (!order) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9FAFB' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '40px', borderRadius: '32px', textAlign: 'center', maxWidth: '400px', width: '100%', border: '1px solid #F1F5F9' }}>
          <XCircle size={48} color="#EF4444" style={{ margin: '0 auto 24px' }} />
          <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A', marginBottom: '8px' }}>Pesanan Tidak Ditemukan</h2>
          <Link href="/dashboard/kasir/orders" style={{ display: 'block', marginTop: '24px', padding: '16px', backgroundColor: '#0F172A', color: '#FFFFFF', fontWeight: 800, borderRadius: '16px', textDecoration: 'none' }}>Kembali ke Riwayat</Link>
        </div>
      </div>
    );
  }

  const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case "PENDING": return { bg: '#FFF7ED', text: '#C2410C', border: '#FFEDD5', label: 'SIAP', icon: <Clock size={16} /> };
      case "PROCESSING": return { bg: '#EFF6FF', text: '#1D4ED8', border: '#DBEAFE', label: 'DIMASAK', icon: <PlayCircle size={16} /> };
      case "COMPLETED": return { bg: '#F0FDF4', text: '#15803D', border: '#DCFCE7', label: 'SELESAI', icon: <CheckCircle2 size={16} /> };
      case "CANCELLED": return { bg: '#FEF2F2', text: '#B91C1C', border: '#FEE2E2', label: 'BATAL', icon: <XCircle size={16} /> };
      default: return { bg: '#F9FAFB', text: '#374151', border: '#F3F4F6', label: status, icon: <Package size={16} /> };
    }
  };

  const style = getStatusStyle(order.status);
  const totalItem = order.items.reduce((sum, item) => sum + item.quantity, 0);

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
          <Link href="/dashboard/kasir/orders" style={{ color: '#FFC107', textDecoration: 'none', fontSize: '14px', fontWeight: 800 }}>Riwayat Pesanan</Link>
        </nav>
        <form action={logoutAction}><button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', borderRadius: '12px', fontSize: '13px', fontWeight: 800, border: '1px solid rgba(239, 68, 68, 0.2)', cursor: 'pointer' }}><LogOut size={18} /><span>Keluar</span></button></form>
      </header>

      <main style={{ flex: 1, padding: '40px', maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/dashboard/kasir/orders" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '44px', height: '44px', backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #F1F5F9', color: '#64748B' }}><ChevronLeft size={20} /></Link>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A', margin: 0 }}>Detail Pesanan #{order.id}</h2>
            <p style={{ margin: 0, color: '#94A3B8', fontWeight: 600 }}>Informasi lengkap transaksi pelanggan</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '32px', padding: '32px', border: '1px solid #F1F5F9', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
              <div><p style={{ margin: '0 0 8px 0', fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Nomor Meja</p><div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><div style={{ width: '40px', height: '40px', backgroundColor: '#0F172A', color: '#FFFFFF', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>{order.table.number}</div><span style={{ fontWeight: 800, color: '#0F172A', fontSize: '18px' }}>Meja {order.table.number}</span></div></div>
              <div><p style={{ margin: '0 0 8px 0', fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Status Saat Ini</p><div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '12px', fontSize: '12px', fontWeight: 800, backgroundColor: style.bg, color: style.text, border: `1px solid ${style.border}` }}>{style.icon}{style.label}</div></div>
              <div><p style={{ margin: '0 0 8px 0', fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Waktu Transaksi</p><span style={{ fontWeight: 800, color: '#334155' }}>{order.createdAt.toLocaleString("id-ID")}</span></div>
            </div>

            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '32px', border: '1px solid #F1F5F9', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead><tr style={{ borderBottom: '1px solid #F1F5F9', backgroundColor: '#F8FAFC' }}><th style={{ padding: '20px 32px', fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Menu</th><th style={{ padding: '20px 32px', fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Harga</th><th style={{ padding: '20px 32px', fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', textAlign: 'center' }}>Qty</th><th style={{ padding: '20px 32px', fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', textAlign: 'right' }}>Subtotal</th></tr></thead>
                <tbody>{order.items.map((item) => (<tr key={item.id} style={{ borderBottom: '1px solid #F8FAFC' }}><td style={{ padding: '16px 32px', fontWeight: 800, color: '#0F172A' }}>{item.menu.name}</td><td style={{ padding: '16px 32px', color: '#64748B', fontWeight: 600 }}>Rp {Number(item.price).toLocaleString("id-ID")}</td><td style={{ padding: '16px 32px', textAlign: 'center', fontWeight: 900 }}>{item.quantity}</td><td style={{ padding: '16px 32px', textAlign: 'right', fontWeight: 900, color: '#0F172A' }}>Rp {(Number(item.price) * item.quantity).toLocaleString("id-ID")}</td></tr>))}</tbody>
              </table>
              <div style={{ padding: '32px', backgroundColor: '#0F172A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><p style={{ margin: 0, fontSize: '11px', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>Total Item</p><span style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: 900 }}>{totalItem} Produk</span></div>
                <div style={{ textAlign: 'right' }}><p style={{ margin: 0, fontSize: '11px', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>Grand Total</p><span style={{ color: '#FFC107', fontSize: '32px', fontWeight: 900 }}>Rp {Number(order.total).toLocaleString("id-ID")}</span></div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '32px', padding: '32px', border: '1px solid #F1F5F9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
              <h3 style={{ margin: '0 0 24px 0', fontSize: '16px', fontWeight: 900, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '12px' }}><RefreshCcw size={20} color="#FFC107" /> Update Status</h3>
              <form action={updateOrderStatusAction} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <input type="hidden" name="id" value={order.id} />
                <select name="status" defaultValue={order.status} style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1px solid #E2E8F0', fontWeight: 700, outline: 'none' }}>
                  <option value="PENDING">SIAP (Pending)</option>
                  <option value="PROCESSING">DIMASAK (Processing)</option>
                  <option value="COMPLETED">SELESAI (Done)</option>
                  <option value="CANCELLED">BATAL (Cancel)</option>
                </select>
                <button type="submit" style={{ padding: '16px', backgroundColor: '#0F172A', color: '#FFFFFF', fontWeight: 800, borderRadius: '14px', border: 'none', cursor: 'pointer' }}>Simpan Perubahan</button>
              </form>
            </div>
            {order.status !== "COMPLETED" && order.status !== "CANCELLED" && (
              <Link href={`/dashboard/kasir/payment/${order.id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '24px', backgroundColor: '#FFC107', color: '#0F172A', fontWeight: 900, borderRadius: '24px', textDecoration: 'none', boxShadow: '0 10px 25px -5px rgba(255, 193, 7, 0.4)', fontSize: '16px' }}><CreditCard size={24} /> BAYAR SEKARANG</Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

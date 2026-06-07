import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { OrderStatus } from "@prisma/client";
import { Search, Filter, ClipboardList, Eye, CreditCard, ChevronLeft, ChevronRight, Calendar, ShoppingBag, Coffee, LogOut } from "lucide-react";
import { logoutAction } from "../../../auth/actions";

export const dynamic = "force-dynamic";

interface OrdersPageProps {
  searchParams: Promise<{
    status?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function CashierOrdersPage({ searchParams }: OrdersPageProps) {
  const params = await searchParams;
  const status = params.status || "ALL";
  const search = params.search || "";
  const page = Number(params.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  // Build Filter
  const where: any = {};
  if (status !== "ALL") where.status = status as OrderStatus;
  if (search) {
    if (!isNaN(Number(search))) {
      where.OR = [{ id: Number(search) }, { table: { number: Number(search) } }];
    }
  }

  // Fetch Data
  const [orders, totalCount] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { table: true, items: { include: { menu: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case "PENDING": return { bg: '#FFF7ED', text: '#C2410C', border: '#FFEDD5', label: 'SIAP' };
      case "PROCESSING": return { bg: '#EFF6FF', text: '#1D4ED8', border: '#DBEAFE', label: 'DIMASAK' };
      case "COMPLETED": return { bg: '#F0FDF4', text: '#15803D', border: '#DCFCE7', label: 'SELESAI' };
      case "CANCELLED": return { bg: '#FEF2F2', text: '#B91C1C', border: '#FEE2E2', label: 'BATAL' };
      default: return { bg: '#F9FAFB', text: '#374151', border: '#F3F4F6', label: status };
    }
  };

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div 
      className="min-h-screen flex flex-col font-sans"
      style={{ backgroundColor: '#F9FAFB', fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      {/* HEADER */}
      <header 
        style={{ 
          backgroundColor: '#0F172A', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', 
          alignItems: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 30 
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', backgroundColor: '#FFC107', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Coffee style={{ color: '#0F172A', width: '22px', height: '22px' }} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
              WARKOP<span style={{ color: '#FFC107' }}>POS</span>
            </h1>
          </div>
        </div>
        <nav style={{ display: 'flex', gap: '32px' }}>
          <Link href="/dashboard/kasir" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '14px', fontWeight: 700 }}>POS Kasir</Link>
          <Link href="/dashboard/kasir/orders" style={{ color: '#FFC107', textDecoration: 'none', fontSize: '14px', fontWeight: 800 }}>Riwayat Pesanan</Link>
        </nav>
        <form action={logoutAction}>
          <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', borderRadius: '12px', fontSize: '13px', fontWeight: 800, border: '1px solid rgba(239, 68, 68, 0.2)', cursor: 'pointer' }}>
            <LogOut size={18} />
            <span>Keluar</span>
          </button>
        </form>
      </header>

      <main style={{ flex: 1, padding: '40px', maxWidth: '1400px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#0F172A', margin: 0 }}>Riwayat Transaksi</h2>
            <p style={{ margin: '4px 0 0 0', color: '#64748B', fontWeight: 600 }}>Daftar seluruh pesanan pelanggan</p>
          </div>
          <div style={{ backgroundColor: '#FFFFFF', padding: '12px 24px', borderRadius: '20px', border: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ShoppingBag size={20} style={{ color: '#1D4ED8' }} />
            <span style={{ fontWeight: 800, color: '#0F172A' }}>{totalCount} Total Pesanan</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#FFFFFF', padding: '6px', borderRadius: '20px', border: '1px solid #F1F5F9', display: 'flex', gap: '4px' }}>
            {["ALL", "PENDING", "PROCESSING", "COMPLETED", "CANCELLED"].map((s) => (
              <Link
                key={s}
                href={`/dashboard/kasir/orders?status=${s}&search=${search}`}
                style={{
                  padding: '10px 20px', borderRadius: '14px', fontSize: '11px', fontWeight: 800, textDecoration: 'none',
                  backgroundColor: status === s ? '#0F172A' : 'transparent', color: status === s ? '#FFFFFF' : '#64748B',
                }}
              >
                {s === "ALL" ? "SEMUA" : s === "PENDING" ? "SIAP" : s === "PROCESSING" ? "DIMASAK" : s === "COMPLETED" ? "SELESAI" : "BATAL"}
              </Link>
            ))}
          </div>
          <form style={{ flex: 1, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input name="search" defaultValue={search} placeholder="Cari ID Pesanan atau Nomor Meja..." style={{ width: '100%', backgroundColor: '#FFFFFF', border: '1px solid #F1F5F9', borderRadius: '20px', padding: '16px 20px 16px 52px', fontSize: '14px', fontWeight: 600, outline: 'none' }} />
          </form>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '32px', border: '1px solid #F1F5F9', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #F1F5F9', backgroundColor: '#F8FAFC' }}>
                <th style={{ padding: '24px 32px', fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>ID Pesanan</th>
                <th style={{ padding: '24px 32px', fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Meja</th>
                <th style={{ padding: '24px 32px', fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Total</th>
                <th style={{ padding: '24px 32px', fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '24px 32px', fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Waktu</th>
                <th style={{ padding: '24px 32px', fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const style = getStatusStyle(order.status);
                return (
                  <tr key={order.id} style={{ borderBottom: '1px solid #F8FAFC' }}>
                    <td style={{ padding: '20px 32px', fontSize: '14px', fontWeight: 800 }}>#{order.id}</td>
                    <td style={{ padding: '20px 32px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '32px', height: '32px', backgroundColor: '#0F172A', color: '#FFFFFF', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 900 }}>{order.table.number}</div>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748B' }}>Meja {order.table.number}</span>
                      </div>
                    </td>
                    <td style={{ padding: '20px 32px', fontSize: '14px', fontWeight: 900 }}>Rp {Number(order.total).toLocaleString("id-ID")}</td>
                    <td style={{ padding: '20px 32px' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '10px', fontSize: '10px', fontWeight: 800, backgroundColor: style.bg, color: style.text, border: `1px solid ${style.border}` }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: style.text }}></div>
                        {style.label}
                      </div>
                    </td>
                    <td style={{ padding: '20px 32px', fontSize: '13px', fontWeight: 600, color: '#64748B' }}>{order.createdAt.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}</td>
                    <td style={{ padding: '20px 32px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                        <Link 
                          href={`/dashboard/kasir/orders/${order.id}`} 
                          style={{ padding: '10px', backgroundColor: '#F8FAFC', color: '#64748B', borderRadius: '12px', border: '1px solid #F1F5F9', textDecoration: 'none', display: 'inline-flex' }}
                        >
                          <Eye size={18} />
                        </Link>
                        {order.status !== "COMPLETED" && order.status !== "CANCELLED" && (
                          <Link
                            href={`/dashboard/kasir/payment/${order.id}`}
                            style={{ padding: '10px', backgroundColor: '#F0FDF4', color: '#16A34A', borderRadius: '12px', border: '1px solid #DCFCE7', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <CreditCard size={18} />
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {orders.length === 0 && <div style={{ padding: '80px', textAlign: 'center' }}><ClipboardList size={48} style={{ color: '#E2E8F0', marginBottom: '16px' }} /><p style={{ fontWeight: 700, color: '#94A3B8' }}>Tidak ada transaksi</p></div>}
        </div>

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
            <Link href={`/dashboard/kasir/orders?status=${status}&search=${search}&page=${Math.max(1, page - 1)}`} style={{ padding: '12px', borderRadius: '12px', backgroundColor: '#FFFFFF', border: '1px solid #F1F5F9', opacity: page === 1 ? 0.5 : 1, pointerEvents: page === 1 ? 'none' : 'auto' }}><ChevronLeft size={20} /></Link>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link key={p} href={`/dashboard/kasir/orders?status=${status}&search=${search}&page=${p}`} style={{ width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', backgroundColor: page === p ? '#0F172A' : '#FFFFFF', color: page === p ? '#FFFFFF' : '#64748B', border: '1px solid #F1F5F9', textDecoration: 'none', fontWeight: 800 }}>{p}</Link>
            ))}
            <Link href={`/dashboard/kasir/orders?status=${status}&search=${search}&page=${Math.min(totalPages, page + 1)}`} style={{ padding: '12px', borderRadius: '12px', backgroundColor: '#FFFFFF', border: '1px solid #F1F5F9', opacity: page === totalPages ? 0.5 : 1, pointerEvents: page === totalPages ? 'none' : 'auto' }}><ChevronRight size={20} /></Link>
          </div>
        )}
      </main>
    </div>
  );
}

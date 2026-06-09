import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { OrderStatus } from "@/types/prisma";
import { Search, ClipboardList, Eye, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

interface OrdersPageProps {
  searchParams: Promise<{
    status?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const params = await searchParams;
  const status = params.status || "ALL";
  const search = params.search || "";
  const page = Number(params.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  // Build Filter
  const where: any = {};
  
  if (status !== "ALL") {
    where.status = status as OrderStatus;
  }

  if (search) {
    if (!isNaN(Number(search))) {
      where.OR = [
        { id: Number(search) },
        { table: { number: Number(search) } }
      ];
    }
  }

  // Fetch Data
  const [orders, totalCount] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        table: true,
        orderitem: {
          include: {
            menu: true,
          },
        },
      } as any,
      orderBy: {
        createdAt: "desc",
      },
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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>Riwayat Transaksi</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', color: '#64748B', fontSize: '14px', fontWeight: 600 }}>
            <ClipboardList size={16} />
            <span>Kelola dan pantau seluruh pesanan pelanggan</span>
          </div>
        </div>
        
        <div style={{ backgroundColor: '#FFFFFF', padding: '16px 24px', borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '44px', height: '44px', backgroundColor: '#EFF6FF', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1D4ED8' }}>
            <ShoppingBag size={22} style={{ margin: 'auto' }} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Transaksi</p>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>{totalCount} Rekaman</p>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTERS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#FFFFFF', padding: '6px', borderRadius: '20px', border: '1px solid #F1F5F9', display: 'flex', gap: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', overflowX: 'auto', maxWidth: '100%' }}>
            {["ALL", "PENDING", "PROCESSING", "COMPLETED", "CANCELLED"].map((s) => (
              <Link
                key={s}
                href={`/admin/orders?status=${s}&search=${search}`}
                style={{
                  padding: '10px 24px',
                  borderRadius: '14px',
                  fontSize: '11px',
                  fontWeight: 800,
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  backgroundColor: status === s ? '#0F172A' : 'transparent',
                  color: status === s ? '#FFFFFF' : '#64748B',
                  whiteSpace: 'nowrap'
                }}
              >
                {s === "ALL" ? "SEMUA STATUS" : s === "PENDING" ? "SIAP" : s === "PROCESSING" ? "DIMASAK" : s === "COMPLETED" ? "SELESAI" : "BATAL"}
              </Link>
            ))}
          </div>

          <form style={{ flex: 1, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input 
              name="search"
              type="text"
              defaultValue={search}
              placeholder="Cari berdasarkan ID Pesanan atau Nomor Meja..."
              style={{
                width: '100%',
                backgroundColor: '#FFFFFF',
                border: '1px solid #F1F5F9',
                borderRadius: '20px',
                padding: '16px 20px 16px 52px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#0F172A',
                outline: 'none',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}
            />
          </form>
        </div>
      </div>

      {/* TABLE */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '40px', border: '1px solid #F1F5F9', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #F1F5F9', backgroundColor: '#F8FAFC' }}>
              <th style={{ padding: '24px 32px', fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ID Pesanan</th>
              <th style={{ padding: '24px 32px', fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Meja</th>
              <th style={{ padding: '24px 32px', fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Item</th>
              <th style={{ padding: '24px 32px', fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Tagihan</th>
              <th style={{ padding: '24px 32px', fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
              <th style={{ padding: '24px 32px', fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tanggal & Waktu</th>
              <th style={{ padding: '24px 32px', fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const statusStyle = getStatusStyle(order.status);
              const itemCount = (order as any).orderitem.reduce((sum: number, item: any) => sum + item.quantity, 0);
              return (
                <tr key={order.id} style={{ borderBottom: '1px solid #F8FAFC' }}>
                  <td style={{ padding: '20px 32px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>#{order.id}</span>
                  </td>
                  <td style={{ padding: '20px 32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '32px', height: '32px', backgroundColor: '#0F172A', color: '#FFFFFF', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 900 }}>
                        {(order as any).table.number}
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B' }}>Meja {(order as any).table.number}</span>
                    </div>
                  </td>
                  <td style={{ padding: '20px 32px', textAlign: 'center' }}>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>{itemCount}</span>
                  </td>
                  <td style={{ padding: '20px 32px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 900, color: '#0F172A' }}>Rp {Number(order.total).toLocaleString("id-ID")}</span>
                  </td>
                  <td style={{ padding: '20px 32px' }}>
                    <div style={{ 
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '10px',
                      fontSize: '10px',
                      fontWeight: 800,
                      backgroundColor: statusStyle.bg,
                      color: statusStyle.text,
                      border: `1px solid ${statusStyle.border}`,
                      letterSpacing: '0.05em'
                    }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: statusStyle.text }}></div>
                      {statusStyle.label}
                    </div>
                  </td>
                  <td style={{ padding: '20px 32px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>{formatDate(order.createdAt).split(',')[0]}</span>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8' }}>{formatDate(order.createdAt).split(',')[1]}</span>
                    </div>
                  </td>
                  <td style={{ padding: '20px 32px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        style={{ padding: '10px', backgroundColor: '#F8FAFC', color: '#64748B', borderRadius: '12px', border: '1px solid #F1F5F9', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Eye size={18} />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {orders.length === 0 && (
          <div style={{ padding: '100px', textAlign: 'center' }}>
            <ClipboardList size={64} style={{ color: '#E2E8F0', marginBottom: '24px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A', margin: '0 0 8px 0' }}>Tidak ada transaksi ditemukan</h3>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#94A3B8' }}>Coba sesuaikan pencarian atau filter Anda</p>
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div style={{ padding: '32px', display: 'flex', justifyContent: 'center', gap: '12px', borderTop: '1px solid #F1F5F9', backgroundColor: '#F8FAFC' }}>
            <Link
              href={`/admin/orders?status=${status}&search=${search}&page=${Math.max(1, page - 1)}`}
              style={{
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '14px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #F1F5F9',
                color: '#64748B',
                textDecoration: 'none',
                opacity: page === 1 ? 0.5 : 1,
                pointerEvents: page === 1 ? 'none' : 'auto'
              }}
            >
              <ChevronLeft size={20} />
            </Link>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/admin/orders?status=${status}&search=${search}&page=${p}`}
                style={{
                  width: '44px',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '14px',
                  backgroundColor: page === p ? '#0F172A' : '#FFFFFF',
                  color: page === p ? '#FFFFFF' : '#64748B',
                  border: '1px solid #F1F5F9',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 800
                }}
              >
                {p}
              </Link>
            ))}

            <Link
              href={`/admin/orders?status=${status}&search=${search}&page=${Math.min(totalPages, page + 1)}`}
              style={{
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '14px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #F1F5F9',
                color: '#64748B',
                textDecoration: 'none',
                opacity: page === totalPages ? 0.5 : 1,
                pointerEvents: page === totalPages ? 'none' : 'auto'
              }}
            >
              <ChevronRight size={20} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

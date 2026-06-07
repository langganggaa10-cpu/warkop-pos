import { prisma } from "@/lib/prisma";
import CashierInterface from "@/components/cashier/CashierInterface";
import Link from "next/link";
import { logoutAction } from "@/app/auth/actions";
import { 
  LayoutDashboard, 
  LogOut, 
  Coffee, 
  ClipboardList, 
  Users, 
  DollarSign, 
  TrendingUp,
  Table as TableIcon,
  ShoppingBag,
  Clock
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CashierPage() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  // Ambil data statistik untuk dashboard kasir
  const [menus, tables, ordersToday, revenueToday, tablesActive] = await Promise.all([
    prisma.menu.findMany({ orderBy: { name: "asc" } }),
    prisma.$queryRaw`SELECT * FROM \`Table\` ORDER BY number ASC` as Promise<any[]>,
    prisma.order.count({
      where: { createdAt: { gte: startOfToday } }
    }),
    prisma.order.aggregate({
      where: { 
        status: "COMPLETED",
        createdAt: { gte: startOfToday }
      },
      _sum: { total: true }
    }),
    prisma.table.count({ where: { isActive: true } })
  ]);

  // Ambil pesanan aktif untuk kasir
  const activeOrders = await prisma.order.findMany({
    where: {
      status: {
        in: ["PENDING", "PROCESSING"],
      },
    },
    include: {
      table: true,
      items: {
        include: {
          menu: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const occupiedTableIds = tables.filter(t => Boolean(t.isOccupied)).map(t => t.id);

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div 
      className="min-h-screen flex flex-col font-sans relative overflow-hidden"
      style={{ 
        backgroundColor: '#F9FAFB', 
        fontFamily: 'Inter, system-ui, sans-serif'
      }}
    >
      {/* DECORATIVE BACKGROUND ELEMENTS */}
      <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', backgroundColor: '#FFC107', opacity: 0.03, borderRadius: '50%', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', bottom: '10%', left: '-50px', width: '250px', height: '250px', backgroundColor: '#3B82F6', opacity: 0.02, borderRadius: '50%', zIndex: 0 }}></div>
      
      {/* TOP NAVIGATION BAR */}
      <header 
        style={{ 
          backgroundColor: '#0F172A', 
          padding: '16px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 30
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div 
            style={{ 
              width: '40px', 
              height: '40px', 
              backgroundColor: '#FFC107', 
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Coffee style={{ color: '#0F172A', width: '22px', height: '22px' }} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
              WARKOP<span style={{ color: '#FFC107' }}>POS</span>
            </h1>
            <p style={{ margin: 0, fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Terminal Kasir Aktif</p>
          </div>
        </div>

        <nav style={{ display: 'flex', gap: '32px' }}>
          <Link href="/dashboard/kasir" style={{ color: '#FFC107', textDecoration: 'none', fontSize: '14px', fontWeight: 800 }}>POS Kasir</Link>
          <Link href="/dashboard/kasir/orders" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '14px', fontWeight: 700 }}>Riwayat Pesanan</Link>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <form action={logoutAction}>
            <button 
              type="submit"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                padding: '10px 20px', 
                backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                color: '#EF4444', 
                borderRadius: '12px', 
                fontSize: '13px', 
                fontWeight: 800, 
                border: '1px solid rgba(239, 68, 68, 0.2)',
                cursor: 'pointer'
              }}
            >
              <LogOut size={18} />
              <span>Keluar</span>
            </button>
          </form>
        </div>
      </header>

      {/* DASHBOARD STATS SECTION */}
      <div style={{ padding: '32px 40px 0 40px', maxWidth: '1600px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
          <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '32px', border: '1px solid #F1F5F9', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.03), 0 4px 6px -2px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '20px', transition: 'transform 0.2s' }} className="stat-card">
            <div style={{ width: '56px', height: '56px', backgroundColor: '#F0FDF4', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#15803D' }}>
              <DollarSign size={28} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pendapatan Hari Ini</p>
              <p style={{ margin: '4px 0 0 0', fontSize: '20px', fontWeight: 900, color: '#0F172A' }}>Rp {Number(revenueToday._sum.total || 0).toLocaleString("id-ID")}</p>
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '32px', border: '1px solid #F1F5F9', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.03), 0 4px 6px -2px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '20px', transition: 'transform 0.2s' }} className="stat-card">
            <div style={{ width: '56px', height: '56px', backgroundColor: '#EFF6FF', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1D4ED8' }}>
              <ShoppingBag size={28} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Jumlah Pesanan</p>
              <p style={{ margin: '4px 0 0 0', fontSize: '20px', fontWeight: 900, color: '#0F172A' }}>{ordersToday} Pesanan</p>
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '32px', border: '1px solid #F1F5F9', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.03), 0 4px 6px -2px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '20px', transition: 'transform 0.2s' }} className="stat-card">
            <div style={{ width: '56px', height: '56px', backgroundColor: '#FFF7ED', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C2410C' }}>
              <TableIcon size={28} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Meja Terisi</p>
              <p style={{ margin: '4px 0 0 0', fontSize: '20px', fontWeight: 900, color: '#0F172A' }}>{occupiedTableIds.length} / {tables.length}</p>
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '32px', border: '1px solid #F1F5F9', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.03), 0 4px 6px -2px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '20px', transition: 'transform 0.2s' }} className="stat-card">
            <div style={{ width: '56px', height: '56px', backgroundColor: '#F5F3FF', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7C3AED' }}>
              <Clock size={28} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status Sistem</p>
              <p style={{ margin: '4px 0 0 0', fontSize: '14px', fontWeight: 900, color: '#15803D' }}>OPERASIONAL</p>
            </div>
          </div>
        </div>
      </div>

      {/* ACTIVE ORDERS SECTION */}
      {activeOrders.length > 0 && (
        <div style={{ padding: '32px 40px 0 40px', maxWidth: '1600px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ width: '6px', height: '24px', backgroundColor: '#FFC107', borderRadius: '4px' }}></div>
            <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A', margin: 0 }}>Pesanan Perlu Dibayar ({activeOrders.length})</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '24px' }}>
            {activeOrders.map((order) => (
              <div key={order.id} style={{ backgroundColor: '#FFFFFF', borderRadius: '40px', padding: '32px', border: '1px solid #F1F5F9', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '24px', transition: 'all 0.3s' }} className="order-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '52px', height: '52px', backgroundColor: '#0F172A', color: '#FFFFFF', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 900, boxShadow: '0 8px 16px -4px rgba(15, 23, 42, 0.2)' }}>
                      {order.table.number}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 900, color: '#0F172A' }}>Pesanan #{order.id}</h4>
                      <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: '#94A3B8' }}>Meja {order.table.number} • {order.createdAt.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  <div style={{ padding: '8px 16px', borderRadius: '12px', fontSize: '10px', fontWeight: 900, backgroundColor: '#FFF7ED', color: '#C2410C', border: '1px solid #FFEDD5', letterSpacing: '0.05em' }}>
                    SIAP BAYAR
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '0 4px' }}>
                  {order.items.slice(0, 3).map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '6px', height: '6px', backgroundColor: '#CBD5E1', borderRadius: '50%' }}></div>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: '#475569' }}>{item.menu.name}</span>
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: 900, color: '#0F172A' }}>x{item.quantity}</span>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <p style={{ margin: '4px 0 0 0', fontSize: '12px', fontWeight: 700, color: '#3B82F6', fontStyle: 'italic', backgroundColor: '#EFF6FF', padding: '6px 12px', borderRadius: '8px', width: 'fit-content' }}>+{order.items.length - 3} item lainnya</p>
                  )}
                </div>

                <div style={{ paddingTop: '24px', borderTop: '2px dashed #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Tagihan</p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '24px', fontWeight: 900, color: '#0F172A' }}>Rp {Number(order.total).toLocaleString("id-ID")}</p>
                  </div>
                  <Link
                    href={`/dashboard/kasir/payment/${order.id}`}
                    style={{ 
                      padding: '14px 28px', 
                      backgroundColor: '#FFC107', 
                      color: '#0F172A', 
                      borderRadius: '18px', 
                      fontSize: '14px', 
                      fontWeight: 900, 
                      textDecoration: 'none',
                      boxShadow: '0 12px 24px -6px rgba(255, 193, 7, 0.4)',
                      transition: 'all 0.2s'
                    }}
                    className="payment-btn"
                  >
                    Bayar Sekarang
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA: POS INTERFACE */}
      <main 
        style={{ 
          flex: 1,
          padding: '32px 40px',
          maxWidth: '1600px',
          margin: '0 auto',
          width: '100%',
          position: 'relative',
          zIndex: 1
        }}
      >
        <CashierInterface 
          menus={menus} 
          tables={tables as any} 
          occupiedTableIds={occupiedTableIds} 
        />
      </main>

      {/* FOOTER */}
      <footer 
        style={{ 
          padding: '24px', 
          textAlign: 'center',
          color: '#94A3B8',
          fontSize: '12px',
          fontWeight: 600
        }}
      >
        {today} &bull; Warkop POS Modern System &bull; Kasir: Aktif
      </footer>
    </div>
  );
}

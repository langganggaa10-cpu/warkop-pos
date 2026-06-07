import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { OrderStatus } from "@/types/prisma";
import { Search, Filter, CheckCircle2, Clock, PlayCircle, ClipboardList, TrendingUp, Users, DollarSign, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  // Fetch active orders (PENDING, PROCESSING)
  const orders = await prisma.order.findMany({
    where: {
      status: {
        in: ["PENDING", "PROCESSING"] as OrderStatus[],
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

  // Stats
  const totalOrdersToday = await prisma.order.count({
    where: {
      createdAt: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
      }
    }
  });

  const totalRevenueToday = await prisma.order.aggregate({
    where: {
      status: "COMPLETED",
      createdAt: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
      }
    },
    _sum: {
      total: true
    }
  });

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case "PENDING": return "SIAP";
      case "PROCESSING": return "DIMASAK";
      case "COMPLETED": return "SELESAI";
      default: return status;
    }
  };

  const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case "PENDING": return { bg: '#FFF7ED', text: '#C2410C', border: '#FFEDD5' };
      case "PROCESSING": return { bg: '#EFF6FF', text: '#1D4ED8', border: '#DBEAFE' };
      case "COMPLETED": return { bg: '#F0FDF4', text: '#15803D', border: '#DCFCE7' };
      default: return { bg: '#F9FAFB', text: '#374151', border: '#F3F4F6' };
    }
  };

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>Ringkasan Dashboard</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', color: '#64748B', fontSize: '14px', fontWeight: 600 }}>
            <Calendar size={16} />
            <span>{today}</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ backgroundColor: '#FFFFFF', padding: '16px 24px', borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '44px', height: '44px', backgroundColor: '#F0FDF4', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#15803D' }}>
              <DollarSign size={22} style={{ margin: 'auto' }} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pendapatan Hari Ini</p>
              <p style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>Rp {Number(totalRevenueToday._sum.total || 0).toLocaleString("id-ID")}</p>
            </div>
          </div>
          
          <div style={{ backgroundColor: '#FFFFFF', padding: '16px 24px', borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '44px', height: '44px', backgroundColor: '#EFF6FF', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1D4ED8' }}>
              <TrendingUp size={22} style={{ margin: 'auto' }} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pesanan Hari Ini</p>
              <p style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>{totalOrdersToday} Pesanan</p>
            </div>
          </div>
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '6px', borderRadius: '20px', border: '1px solid #F1F5F9', display: 'flex', gap: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          {["Semua", "Proses", "Selesai"].map((filter, idx) => (
            <button
              key={filter}
              style={{
                padding: '10px 24px',
                borderRadius: '14px',
                fontSize: '12px',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: idx === 1 ? '#0F172A' : 'transparent',
                color: idx === 1 ? '#FFFFFF' : '#64748B',
              }}
            >
              {filter}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input 
            type="text"
            placeholder="Cari pesanan, meja, atau menu..."
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
        </div>
      </div>

      {/* SECTION TITLE */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '6px', height: '24px', backgroundColor: '#FFC107', borderRadius: '4px' }}></div>
        <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A', margin: 0 }}>Pesanan Aktif ({orders.length})</h3>
      </div>

      {/* ORDER GRID */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', 
        gap: '32px' 
      }}>
        {orders.map((order) => {
          const statusStyle = getStatusStyle(order.status);
          return (
            <div key={order.id} style={{ 
              backgroundColor: '#FFFFFF', 
              borderRadius: '40px', 
              padding: '40px', 
              border: '1px solid #F1F5F9', 
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* STATUS BADGE */}
              <div style={{ 
                position: 'absolute', 
                top: '40px', 
                right: '40px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '12px',
                fontSize: '10px',
                fontWeight: 800,
                backgroundColor: statusStyle.bg,
                color: statusStyle.text,
                border: `1px solid ${statusStyle.border}`,
                letterSpacing: '0.05em'
              }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: statusStyle.text }}></div>
                {getStatusLabel(order.status)}
              </div>

              {/* CARD TOP */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
                <div style={{ 
                  width: '64px', 
                  height: '64px', 
                  backgroundColor: '#0F172A', 
                  color: '#FFFFFF', 
                  borderRadius: '20px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '24px', 
                  fontWeight: 900,
                  boxShadow: '0 10px 20px -5px rgba(15, 23, 42, 0.3)'
                }}>
                  {order.table.number}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '20px', fontWeight: 900, color: '#0F172A' }}>Pesanan #{order.id}</h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Meja {order.table.number} • {order.createdAt.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              {/* ITEMS LIST */}
              <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #F1F5F9', marginBottom: '16px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Item</span>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Qty</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {order.items.slice(0, 3).map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#334155' }}>{item.menu.name}</span>
                      <span style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>x{item.quantity}</span>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <p style={{ margin: '8px 0 0 0', fontSize: '12px', fontWeight: 700, color: '#94A3B8', textAlign: 'center', fontStyle: 'italic' }}>
                      +{order.items.length - 3} item lainnya
                    </p>
                  )}
                </div>
              </div>

              {/* TOTAL */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-end', 
                paddingTop: '24px', 
                borderTop: '2px dashed #F1F5F9',
                marginBottom: '32px'
              }}>
                <div>
                  <p style={{ margin: 0, fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Total Tagihan</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '28px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.03em' }}>
                    Rp {Number(order.total).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              {/* ACTIONS */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <Link
                  href={`/admin/orders/${order.id}`}
                  style={{ 
                    flex: 1,
                    padding: '16px', 
                    borderRadius: '18px', 
                    backgroundColor: '#F8FAFC', 
                    color: '#475569', 
                    fontSize: '13px', 
                    fontWeight: 800, 
                    textAlign: 'center',
                    textDecoration: 'none',
                    border: '1px solid #F1F5F9',
                    transition: 'all 0.2s'
                  }}
                >
                  Lihat Detail
                </Link>
              </div>
            </div>
          );
        })}

        {orders.length === 0 && (
          <div style={{ 
            gridColumn: '1 / -1', 
            padding: '100px 0', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            backgroundColor: '#FFFFFF', 
            borderRadius: '48px', 
            border: '2px dashed #E2E8F0' 
          }}>
            <div style={{ width: '80px', height: '80px', backgroundColor: '#F8FAFC', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#CBD5E1', marginBottom: '24px' }}>
              <ClipboardList size={40} style={{ margin: 'auto' }} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A', margin: '0 0 8px 0' }}>Tidak ada pesanan aktif</h3>
            <p style={{ margin: '0 0 32px 0', fontSize: '14px', fontWeight: 600, color: '#94A3B8' }}>Pesanan baru akan muncul di sini secara otomatis</p>
            <Link 
              href="/dashboard/kasir" 
              style={{ 
                padding: '16px 32px', 
                backgroundColor: '#0F172A', 
                color: '#FFFFFF', 
                borderRadius: '18px', 
                fontWeight: 800, 
                fontSize: '14px', 
                textDecoration: 'none',
                boxShadow: '0 10px 20px -5px rgba(15, 23, 42, 0.3)'
              }}
            >
              Buka Sistem Kasir
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

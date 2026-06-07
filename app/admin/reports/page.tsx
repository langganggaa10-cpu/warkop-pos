import { prisma } from "@/lib/prisma";
import { 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  PieChart, 
  BarChart3, 
  Calendar,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Utensils
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  // Fetch Stats
  const [
    revenueData,
    totalOrders,
    recentOrders,
    topProducts,
    categoryStats
  ] = await Promise.all([
    // Menggunakan model Order sebagai fallback jika payment bermasalah
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: 'COMPLETED' }
    }),
    prisma.order.count(),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      where: { status: 'COMPLETED' },
      include: { 
        table: true, 
        payment: true 
      }
    }),
    prisma.orderItem.groupBy({
      by: ['menuId'],
      _sum: { quantity: true },
      orderBy: { 
        _sum: { 
          quantity: 'desc' 
        } 
      },
      take: 5
    }),
    prisma.menu.findMany({
      include: { 
        orderItems: {
          include: {
            order: true
          }
        } 
      }
    })
  ]);

  const totalRevenue = Number(revenueData._sum.total || 0);
  const avgTransaction = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Process Top Products with Names
  const topProductsWithNames = await Promise.all(
    topProducts.map(async (item) => {
      const menu = await prisma.menu.findUnique({ where: { id: item.menuId } });
      return {
        name: menu?.name || "Unknown",
        quantity: item._sum.quantity || 0,
        category: menu?.category || "N/A"
      };
    })
  );

  // Process Category Revenue
  const categoryRevenueMap: Record<string, number> = {};
  categoryStats.forEach(menu => {
    const revenue = menu.orderItems.reduce((sum, item) => {
      // Hanya hitung item dari pesanan yang sudah selesai
      if (item.order.status === 'COMPLETED') {
        return sum + (Number(item.price) * item.quantity);
      }
      return sum;
    }, 0);
    categoryRevenueMap[menu.category] = (categoryRevenueMap[menu.category] || 0) + revenue;
  });

  const sortedCategories = Object.entries(categoryRevenueMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>Dashboard Laporan</h2>
          <p style={{ margin: '8px 0 0 0', fontSize: '15px', fontWeight: 600, color: '#64748B' }}>Pantau performa bisnis dan penjualan Anda</p>
        </div>
        
        <div style={{ 
          backgroundColor: '#FFFFFF', 
          padding: '12px 24px', 
          borderRadius: '24px', 
          boxShadow: '0 4px 15px rgba(0,0,0,0.03)', 
          border: '1px solid #F1F5F9', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px'
        }}>
          <Calendar size={20} style={{ color: '#64748B' }} />
          <span style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
            {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* STAT CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '32px', borderRadius: '40px', border: '1px solid #F1F5F9', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ width: '64px', height: '64px', backgroundColor: '#F0FDF4', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16A34A' }}>
            <DollarSign size={32} strokeWidth={2.5} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '12px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Pendapatan</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: 900, color: '#0F172A' }}>Rp {totalRevenue.toLocaleString("id-ID")}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
              <ArrowUpRight size={14} style={{ color: '#16A34A' }} />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#16A34A' }}>+12.5% bln ini</span>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '32px', borderRadius: '40px', border: '1px solid #F1F5F9', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ width: '64px', height: '64px', backgroundColor: '#EFF6FF', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}>
            <ShoppingBag size={32} strokeWidth={2.5} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '12px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Pesanan</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: 900, color: '#0F172A' }}>{totalOrders} <span style={{ fontSize: '14px', fontWeight: 700, color: '#64748B' }}>Pesanan</span></p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
              <ArrowUpRight size={14} style={{ color: '#16A34A' }} />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#16A34A' }}>+5.2% bln ini</span>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', padding: '32px', borderRadius: '40px', border: '1px solid #F1F5F9', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ width: '64px', height: '64px', backgroundColor: '#FFF7ED', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C2410C' }}>
            <TrendingUp size={32} strokeWidth={2.5} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '12px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Rata-rata Transaksi</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: 900, color: '#0F172A' }}>Rp {avgTransaction.toLocaleString("id-ID")}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
              <ArrowDownRight size={14} style={{ color: '#EF4444' }} />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#EF4444' }}>-1.4% bln ini</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        {/* LEFT COLUMN: TOP PRODUCTS & RECENT TRANSACTIONS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* TOP PRODUCTS */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '48px', border: '1px solid #F1F5F9', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
            <div style={{ padding: '32px 40px', borderBottom: '1px solid #F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: '#F8FAFC', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0F172A' }}>
                  <BarChart3 size={20} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A', margin: 0 }}>Produk Terlaris</h3>
              </div>
            </div>
            
            <div style={{ padding: '24px 40px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {topProductsWithNames.map((product, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ width: '48px', height: '48px', backgroundColor: '#F8FAFC', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 900, color: '#0F172A' }}>
                      {index + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>{product.name}</p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '12px', fontWeight: 600, color: '#94A3B8' }}>{product.category}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: 0, fontSize: '16px', fontWeight: 900, color: '#0F172A' }}>{product.quantity}</p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '11px', fontWeight: 700, color: '#16A34A', textTransform: 'uppercase' }}>Terjual</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RECENT TRANSACTIONS */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '48px', border: '1px solid #F1F5F9', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
            <div style={{ padding: '32px 40px', borderBottom: '1px solid #F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: '#F8FAFC', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0F172A' }}>
                  <TrendingUp size={20} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A', margin: 0 }}>Transaksi Terakhir</h3>
              </div>
            </div>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #F8FAFC' }}>
                  <th style={{ padding: '24px 40px', fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>ORDER</th>
                  <th style={{ padding: '24px 40px', fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>MEJA</th>
                  <th style={{ padding: '24px 40px', fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>METODE</th>
                  <th style={{ padding: '24px 40px', fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'right' }}>NOMINAL</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #F8FAFC' }}>
                    <td style={{ padding: '20px 40px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>#{order.id}</span>
                    </td>
                    <td style={{ padding: '20px 40px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#64748B' }}>Meja {order.table.number}</span>
                    </td>
                    <td style={{ padding: '20px 40px' }}>
                      <span style={{ 
                        padding: '6px 12px', 
                        backgroundColor: '#F8FAFC', 
                        borderRadius: '10px', 
                        fontSize: '11px', 
                        fontWeight: 800, 
                        color: '#64748B', 
                        textTransform: 'uppercase'
                      }}>
                        {order.payment?.method || 'CASH'}
                      </span>
                    </td>
                    <td style={{ padding: '20px 40px', textAlign: 'right' }}>
                      <span style={{ fontSize: '15px', fontWeight: 900, color: '#0F172A' }}>Rp {Number(order.total).toLocaleString("id-ID")}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT COLUMN: CATEGORY REVENUE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '48px', border: '1px solid #F1F5F9', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)', padding: '48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
              <div style={{ width: '52px', height: '52px', backgroundColor: '#F8FAFC', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0F172A' }}>
                <PieChart size={24} />
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#0F172A', margin: 0 }}>Penjualan per Kategori</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {sortedCategories.map(([category, revenue], index) => {
                const percentage = totalRevenue > 0 ? (revenue / totalRevenue) * 100 : 0;
                const colors = ['#FFC107', '#2563EB', '#16A34A', '#8B5CF6', '#EC4899'];
                return (
                  <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase' }}>{category}</span>
                      <span style={{ fontSize: '14px', fontWeight: 900, color: '#64748B' }}>{percentage.toFixed(1)}%</span>
                    </div>
                    <div style={{ width: '100%', height: '12px', backgroundColor: '#F8FAFC', borderRadius: '6px', overflow: 'hidden' }}>
                      <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: colors[index % colors.length], borderRadius: '6px' }}></div>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#94A3B8' }}>
                      Rp {revenue.toLocaleString("id-ID")}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: '48px', padding: '32px', backgroundColor: '#F8FAFC', borderRadius: '32px', border: '1px solid #F1F5F9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Utensils size={18} style={{ color: '#FFC107' }} />
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>Saran Bisnis</span>
              </div>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#64748B', lineHeight: '1.6' }}>
                Penjualan kategori <strong>{sortedCategories[0]?.[0] || 'Menu'}</strong> sangat dominan. Pertimbangkan untuk menambah variasi menu pada kategori ini.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

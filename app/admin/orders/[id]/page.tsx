import { prisma } from "@/lib/prisma";
import type { OrderStatus } from "@/types/prisma";
import Link from "next/link";
import { updateOrderStatusAction } from "../actions";
import { ChevronLeft, ClipboardList, Clock, MapPin, Package, CreditCard, RefreshCcw, CheckCircle2, XCircle, PlayCircle, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id: orderIdStr } = await params;
  const orderId = Number(orderIdStr);

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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9FAFB', padding: '16px' }}>
        <div style={{ backgroundColor: '#FFFFFF', padding: '40px', borderRadius: '40px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)', textAlign: 'center', maxWidth: '400px', width: '100%', border: '1px solid #F1F5F9' }}>
          <div style={{ width: '64px', height: '64px', backgroundColor: '#FEF2F2', color: '#EF4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <XCircle size={32} />
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A', marginBottom: '8px' }}>Order Not Found</h1>
          <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '32px' }}>Order ID #{orderIdStr} does not exist in our system.</p>
          <Link 
            href="/admin/orders" 
            style={{ display: 'block', width: '100%', padding: '16px', backgroundColor: '#0F172A', color: '#FFFFFF', fontWeight: 800, borderRadius: '18px', textDecoration: 'none', boxShadow: '0 10px 20px -5px rgba(15, 23, 42, 0.3)' }}
          >
            Back to Transactions
          </Link>
        </div>
      </div>
    );
  }

  const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case "PENDING": return { bg: '#FFF7ED', text: '#C2410C', border: '#FFEDD5', label: 'READY', icon: <Clock size={14} /> };
      case "PROCESSING": return { bg: '#EFF6FF', text: '#1D4ED8', border: '#DBEAFE', label: 'COOKING', icon: <PlayCircle size={14} /> };
      case "COMPLETED": return { bg: '#F0FDF4', text: '#15803D', border: '#DCFCE7', label: 'DONE', icon: <CheckCircle2 size={14} /> };
      case "CANCELLED": return { bg: '#FEF2F2', text: '#B91C1C', border: '#FEE2E2', label: 'CANCEL', icon: <XCircle size={14} /> };
      default: return { bg: '#F9FAFB', text: '#374151', border: '#F3F4F6', label: status, icon: <Package size={14} /> };
    }
  };

  const statusStyle = getStatusStyle(order.status);
  const totalItem = order.orderitem.reduce((sum, item) => sum + item.quantity, 0);
  const grandTotal = Number(order.total);
  const formattedDate = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(order.createdAt);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      {/* TOP BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link 
          href="/admin/orders" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            textDecoration: 'none',
            color: '#64748B',
            fontWeight: 800,
            fontSize: '14px',
            transition: 'all 0.2s'
          }}
        >
          <div style={{ padding: '12px', backgroundColor: '#FFFFFF', borderRadius: '14px', border: '1px solid #F1F5F9', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ChevronLeft size={20} />
          </div>
          Back to List
        </Link>
        <div style={{ textAlign: 'right' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>Order Detail</h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order ID: #{order.id}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>
        {/* SUMMARY CARD */}
        <div style={{ 
          backgroundColor: '#FFFFFF', 
          borderRadius: '40px', 
          padding: '40px', 
          border: '1px solid #F1F5F9', 
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', backgroundColor: '#F8FAFC', borderRadius: '0 0 0 100%', zIndex: 0 }}></div>
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Table Number</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: '#0F172A', color: '#FFFFFF', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 900 }}>
                {order.table.number}
              </div>
              <span style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A' }}>Table {order.table.number}</span>
            </div>
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Status</p>
            <div style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '14px',
              fontSize: '12px',
              fontWeight: 800,
              backgroundColor: statusStyle.bg,
              color: statusStyle.text,
              border: `1px solid ${statusStyle.border}`,
              letterSpacing: '0.05em'
            }}>
              {statusStyle.icon}
              {statusStyle.label}
            </div>
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Transaction Date</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ color: '#94A3B8' }}><Calendar size={20} /></div>
              <span style={{ fontSize: '16px', fontWeight: 800, color: '#334155' }}>{formattedDate}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
          {/* ITEMS LIST */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '40px', border: '1px solid #F1F5F9', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '24px 32px', borderBottom: '1px solid #F1F5F9', backgroundColor: '#F8FAFC' }}>
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 900, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Items Breakdown</h3>
            </div>
            <div style={{ flex: 1 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #F8FAFC' }}>
                    <th style={{ padding: '20px 32px', fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Menu</th>
                    <th style={{ padding: '20px 32px', fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>Price</th>
                    <th style={{ padding: '20px 32px', fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', textAlign: 'center' }}>Qty</th>
                    <th style={{ padding: '20px 32px', fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', textAlign: 'right' }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderitem.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #F8FAFC' }}>
                      <td style={{ padding: '16px 32px', fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>{item.menu.name}</td>
                      <td style={{ padding: '16px 32px', fontSize: '14px', fontWeight: 600, color: '#64748B' }}>Rp {Number(item.price).toLocaleString("id-ID")}</td>
                      <td style={{ padding: '16px 32px', fontSize: '14px', fontWeight: 900, color: '#0F172A', textAlign: 'center' }}>{item.quantity}</td>
                      <td style={{ padding: '16px 32px', fontSize: '14px', fontWeight: 900, color: '#0F172A', textAlign: 'right' }}>
                        Rp {(Number(item.price) * item.quantity).toLocaleString("id-ID")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ padding: '32px', backgroundColor: '#0F172A', color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: '0 0 4px 0', fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Quantity</p>
                <div style={{ fontSize: '20px', fontWeight: 900 }}>{totalItem} Items</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Grand Total</p>
                <div style={{ fontSize: '32px', fontWeight: 900, color: '#FFC107' }}>Rp {grandTotal.toLocaleString("id-ID")}</div>
              </div>
            </div>
          </div>

          {/* STATUS UPDATE PANEL */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '40px', padding: '40px', border: '1px solid #F1F5F9', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', paddingBottom: '20px', borderBottom: '1px solid #F1F5F9' }}>
                <div style={{ color: '#FFC107' }}><RefreshCcw size={20} strokeWidth={3} /></div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 900, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Update Status</h3>
              </div>
              
              <form 
                action={async (formData) => {
                  "use server";
                  await updateOrderStatusAction(formData);
                }} 
                style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
              >
                <input type="hidden" name="id" value={order.id} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginLeft: '4px' }}>Select New Status</label>
                  <select 
                    name="status" 
                    defaultValue={order.status}
                    style={{ width: '100%', backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: '16px', padding: '14px 16px', fontSize: '14px', fontWeight: 700, color: '#0F172A', outline: 'none', cursor: 'pointer' }}
                  >
                    <option value="PENDING">READY (Pending)</option>
                    <option value="PROCESSING">COOKING (Processing)</option>
                    <option value="COMPLETED">DONE (Completed)</option>
                    <option value="CANCELLED">CANCEL (Cancelled)</option>
                  </select>
                </div>
                
                <button 
                  type="submit"
                  style={{ width: '100%', padding: '18px', backgroundColor: '#0F172A', color: '#FFFFFF', fontWeight: 800, borderRadius: '18px', border: 'none', fontSize: '14px', cursor: 'pointer', boxShadow: '0 10px 20px -5px rgba(15, 23, 42, 0.3)', transition: 'all 0.2s' }}
                >
                  Confirm Status Change
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Bell, MessageSquare, AlertTriangle, CheckCircle2, Mail, Smartphone } from "lucide-react";
import Link from "next/link";

export default function NotificationsSettingsPage() {
  const notifOptions = [
    { icon: MessageSquare, label: "Pesanan Baru", desc: "Beritahu saat ada pesanan masuk", status: true },
    { icon: AlertTriangle, label: "Stok Menipis", desc: "Peringatan saat bahan baku/produk habis", status: true },
    { icon: CheckCircle2, label: "Pembayaran Selesai", desc: "Konfirmasi setelah transaksi berhasil", status: false },
    { icon: Mail, label: "Laporan Harian", desc: "Kirim ringkasan penjualan ke email", status: true },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>Notifikasi</h2>
          <p style={{ margin: '8px 0 0 0', fontSize: '15px', fontWeight: 600, color: '#64748B' }}>Atur bagaimana Anda menerima pemberitahuan sistem</p>
        </div>
        <Link href="/admin/settings" style={{ backgroundColor: '#FFFFFF', padding: '12px 24px', borderRadius: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #F1F5F9', textDecoration: 'none', color: '#64748B', fontSize: '14px', fontWeight: 800 }}>Kembali</Link>
      </div>

      <div style={{ maxWidth: '800px', backgroundColor: '#FFFFFF', borderRadius: '48px', padding: '48px', border: '1px solid #F1F5F9', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {notifOptions.map((opt, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: idx !== notifOptions.length - 1 ? '32px' : 0, borderBottom: idx !== notifOptions.length - 1 ? '1px solid #F8FAFC' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ width: '48px', height: '48px', backgroundColor: '#F8FAFC', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0F172A' }}>
                  <opt.icon size={22} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>{opt.label}</h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px', fontWeight: 600, color: '#64748B' }}>{opt.desc}</p>
                </div>
              </div>
              <div style={{ width: '56px', height: '28px', backgroundColor: opt.status ? '#10B981' : '#E2E8F0', borderRadius: '14px', position: 'relative', cursor: 'pointer' }}>
                <div style={{ width: '20px', height: '20px', backgroundColor: '#FFFFFF', borderRadius: '50%', position: 'absolute', top: '4px', left: opt.status ? '32px' : '4px', transition: 'all 0.2s' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

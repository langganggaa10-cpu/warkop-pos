import { Database, Download, Upload, Trash2, History, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function DatabaseSettingsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>Database</h2>
          <p style={{ margin: '8px 0 0 0', fontSize: '15px', fontWeight: 600, color: '#64748B' }}>Kelola cadangan data dan pemeliharaan sistem</p>
        </div>
        <Link href="/admin/settings" style={{ backgroundColor: '#FFFFFF', padding: '12px 24px', borderRadius: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #F1F5F9', textDecoration: 'none', color: '#64748B', fontSize: '14px', fontWeight: 800 }}>Kembali</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '48px', padding: '48px', border: '1px solid #F1F5F9', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A', marginBottom: '32px' }}>Cadangkan & Pulihkan</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <button style={{ padding: '32px', borderRadius: '32px', border: '2px dashed #E2E8F0', backgroundColor: '#F8FAFC', cursor: 'pointer', textAlign: 'center' }}>
                <Download size={32} style={{ color: '#3B82F6', marginBottom: '16px' }} />
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>Ekspor Data</h4>
                <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#64748B' }}>Download file .sql cadangan</p>
              </button>
              <button style={{ padding: '32px', borderRadius: '32px', border: '2px dashed #E2E8F0', backgroundColor: '#F8FAFC', cursor: 'pointer', textAlign: 'center' }}>
                <Upload size={32} style={{ color: '#10B981', marginBottom: '16px' }} />
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>Impor Data</h4>
                <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#64748B' }}>Upload file cadangan sistem</p>
              </button>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: '#FEF2F2', borderRadius: '48px', padding: '48px', border: '1px solid #FEE2E2' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#DC2626', marginBottom: '24px' }}>
            <ShieldAlert size={28} />
            <h3 style={{ fontSize: '18px', fontWeight: 900, margin: 0 }}>Area Berbahaya</h3>
          </div>
          <p style={{ fontSize: '14px', color: '#991B1B', lineHeight: '1.6', marginBottom: '32px' }}>
            Tindakan di bawah ini akan menghapus data secara permanen. Pastikan Anda sudah membackup data terlebih dahulu.
          </p>
          <button style={{ width: '100%', padding: '16px', borderRadius: '16px', backgroundColor: '#DC2626', color: '#FFFFFF', border: 'none', fontWeight: 800, cursor: 'pointer' }}>
            Hapus Semua Transaksi
          </button>
        </div>
      </div>
    </div>
  );
}

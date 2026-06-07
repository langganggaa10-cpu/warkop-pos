import { Monitor, Moon, Sun, Layout, Palette, Type } from "lucide-react";
import Link from "next/link";

export default function AppearanceSettingsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>Tampilan</h2>
          <p style={{ margin: '8px 0 0 0', fontSize: '15px', fontWeight: 600, color: '#64748B' }}>Sesuaikan antarmuka sistem sesuai selera Anda</p>
        </div>
        <Link href="/admin/settings" style={{ backgroundColor: '#FFFFFF', padding: '12px 24px', borderRadius: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #F1F5F9', textDecoration: 'none', color: '#64748B', fontSize: '14px', fontWeight: 800 }}>Kembali</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '48px', padding: '48px', border: '1px solid #F1F5F9', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Moon size={24} style={{ color: '#FFC107' }} /> Mode Tema
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ padding: '24px', borderRadius: '24px', border: '2px solid #FFC107', backgroundColor: '#F8FAFC', textAlign: 'center', cursor: 'pointer' }}>
              <Sun size={32} style={{ color: '#FFC107', marginBottom: '12px' }} />
              <p style={{ margin: 0, fontWeight: 800, color: '#0F172A' }}>Terang</p>
            </div>
            <div style={{ padding: '24px', borderRadius: '24px', border: '1px solid #F1F5F9', backgroundColor: '#F8FAFC', textAlign: 'center', cursor: 'pointer', opacity: 0.6 }}>
              <Moon size={32} style={{ color: '#64748B', marginBottom: '12px' }} />
              <p style={{ margin: 0, fontWeight: 800, color: '#64748B' }}>Gelap</p>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '48px', padding: '48px', border: '1px solid #F1F5F9', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Palette size={24} style={{ color: '#3B82F6' }} /> Warna Aksen
          </h3>
          <div style={{ display: 'flex', gap: '16px' }}>
            {['#FFC107', '#3B82F6', '#10B981', '#EF4444', '#8B5CF6'].map(color => (
              <div key={color} style={{ width: '44px', height: '44px', backgroundColor: color, borderRadius: '50%', cursor: 'pointer', border: color === '#FFC107' ? '4px solid #F1F5F9' : 'none' }}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

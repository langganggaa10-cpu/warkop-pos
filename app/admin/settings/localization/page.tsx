import { Globe, Clock, Coins, MapPin, Languages } from "lucide-react";
import Link from "next/link";

export default function LocalizationSettingsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>Lokasi & Bahasa</h2>
          <p style={{ margin: '8px 0 0 0', fontSize: '15px', fontWeight: 600, color: '#64748B' }}>Atur format mata uang, zona waktu, dan bahasa sistem</p>
        </div>
        <Link href="/admin/settings" style={{ backgroundColor: '#FFFFFF', padding: '12px 24px', borderRadius: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #F1F5F9', textDecoration: 'none', color: '#64748B', fontSize: '14px', fontWeight: 800 }}>Kembali</Link>
      </div>

      <div style={{ maxWidth: '800px', backgroundColor: '#FFFFFF', borderRadius: '48px', padding: '48px', border: '1px solid #F1F5F9', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', marginLeft: '4px' }}>BAHASA SISTEM</label>
            <div style={{ position: 'relative' }}>
              <Languages size={18} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#3B82F6' }} />
              <select style={{ width: '100%', backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: '20px', padding: '18px 20px 18px 56px', fontSize: '14px', fontWeight: 600, outline: 'none', appearance: 'none' }}>
                <option>Bahasa Indonesia</option>
                <option>English (US)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', marginLeft: '4px' }}>MATA UANG</label>
              <div style={{ position: 'relative' }}>
                <Coins size={18} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#10B981' }} />
                <select style={{ width: '100%', backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: '20px', padding: '18px 20px 18px 56px', fontSize: '14px', fontWeight: 600, outline: 'none', appearance: 'none' }}>
                  <option>Rupiah (IDR)</option>
                  <option>US Dollar (USD)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', marginLeft: '4px' }}>ZONA WAKTU</label>
              <div style={{ position: 'relative' }}>
                <Clock size={18} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#F59E0B' }} />
                <select style={{ width: '100%', backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: '20px', padding: '18px 20px 18px 56px', fontSize: '14px', fontWeight: 600, outline: 'none', appearance: 'none' }}>
                  <option>(GMT+07:00) Jakarta</option>
                  <option>(GMT+08:00) Makassar</option>
                  <option>(GMT+09:00) Jayapura</option>
                </select>
              </div>
            </div>
          </div>

          <button style={{ width: '100%', marginTop: '16px', backgroundColor: '#0F172A', color: '#FFFFFF', padding: '20px', borderRadius: '24px', border: 'none', fontSize: '16px', fontWeight: 900, cursor: 'pointer', boxShadow: '0 10px 20px -5px rgba(15, 23, 42, 0.3)' }}>
            Simpan Konfigurasi
          </button>
        </div>
      </div>
    </div>
  );
}

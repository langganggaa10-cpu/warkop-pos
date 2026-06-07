import { Shield, Key, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function SecuritySettingsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>Keamanan Akun</h2>
          <p style={{ margin: '8px 0 0 0', fontSize: '15px', fontWeight: 600, color: '#64748B' }}>Perbarui kata sandi dan amankan akses Anda</p>
        </div>
        
        <Link 
          href="/admin/settings" 
          style={{ 
            backgroundColor: '#FFFFFF', 
            padding: '12px 24px', 
            borderRadius: '24px', 
            boxShadow: '0 4px 15px rgba(0,0,0,0.03)', 
            border: '1px solid #F1F5F9', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            textDecoration: 'none',
            color: '#64748B',
            fontSize: '14px',
            fontWeight: 800
          }}
        >
          Kembali
        </Link>
      </div>

      <div style={{ maxWidth: '600px' }}>
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '48px', padding: '48px', border: '1px solid #F1F5F9', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
            <div style={{ width: '52px', height: '52px', backgroundColor: '#FEF2F2', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}>
              <Lock size={24} />
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A', margin: 0 }}>Ganti Kata Sandi</h3>
          </div>

          <form style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginLeft: '4px' }}>KATA SANDI SAAT INI</label>
              <div style={{ position: 'relative' }}>
                <Key size={18} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input
                  type="password"
                  placeholder="••••••••"
                  style={{ width: '100%', backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: '20px', padding: '18px 20px 18px 56px', fontSize: '14px', fontWeight: 600, outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginLeft: '4px' }}>KATA SANDI BARU</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#10B981' }} />
                <input
                  type="password"
                  placeholder="Minimal 8 karakter"
                  style={{ width: '100%', backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: '20px', padding: '18px 20px 18px 56px', fontSize: '14px', fontWeight: 600, outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginLeft: '4px' }}>KONFIRMASI KATA SANDI BARU</label>
              <div style={{ position: 'relative' }}>
                <Shield size={18} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#10B981' }} />
                <input
                  type="password"
                  placeholder="Ulangi kata sandi baru"
                  style={{ width: '100%', backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: '20px', padding: '18px 20px 18px 56px', fontSize: '14px', fontWeight: 600, outline: 'none' }}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{ 
                width: '100%', 
                marginTop: '16px', 
                backgroundColor: '#0F172A', 
                color: '#FFFFFF', 
                padding: '20px', 
                borderRadius: '24px', 
                border: 'none', 
                fontSize: '16px', 
                fontWeight: 900, 
                cursor: 'pointer', 
                boxShadow: '0 10px 20px -5px rgba(15, 23, 42, 0.3)'
              }}
            >
              Perbarui Kata Sandi
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

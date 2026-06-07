import { User, Mail, Camera, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export default function ProfileSettingsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>Informasi Akun</h2>
          <p style={{ margin: '8px 0 0 0', fontSize: '15px', fontWeight: 600, color: '#64748B' }}>Kelola profil publik dan informasi kontak Anda</p>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
        {/* AVATAR SECTION */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '48px', padding: '48px', border: '1px solid #F1F5F9', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)', textAlign: 'center', height: 'fit-content' }}>
          <div style={{ position: 'relative', width: '160px', height: '160px', margin: '0 auto 32px auto' }}>
            <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: '#F8FAFC', border: '4px solid #FFFFFF', boxShadow: '0 8px 16px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <User size={80} style={{ color: '#E2E8F0' }} />
            </div>
            <button style={{ position: 'absolute', bottom: '8px', right: '8px', width: '44px', height: '44px', backgroundColor: '#0F172A', color: '#FFFFFF', borderRadius: '14px', border: '3px solid #FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Camera size={20} />
            </button>
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A', margin: '0 0 8px 0' }}>Admin Warkop</h3>
          <p style={{ fontSize: '14px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Manager</p>
        </div>

        {/* FORM SECTION */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '48px', padding: '48px', border: '1px solid #F1F5F9', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)' }}>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginLeft: '4px' }}>NAMA LENGKAP</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#3B82F6' }} />
                <input
                  type="text"
                  defaultValue="Admin Warkop"
                  style={{ width: '100%', backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: '20px', padding: '18px 20px 18px 56px', fontSize: '14px', fontWeight: 600, outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginLeft: '4px' }}>ALAMAT EMAIL</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#F59E0B' }} />
                <input
                  type="email"
                  defaultValue="admin@warkoppos.com"
                  style={{ width: '100%', backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: '20px', padding: '18px 20px 18px 56px', fontSize: '14px', fontWeight: 600, outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginLeft: '4px' }}>NO. TELEPON</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#10B981' }} />
                  <input
                    type="text"
                    defaultValue="081234567890"
                    style={{ width: '100%', backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: '20px', padding: '18px 20px 18px 56px', fontSize: '14px', fontWeight: 600, outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginLeft: '4px' }}>LOKASI</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={18} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#EC4899' }} />
                  <input
                    type="text"
                    defaultValue="Jakarta, Indonesia"
                    style={{ width: '100%', backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: '20px', padding: '18px 20px 18px 56px', fontSize: '14px', fontWeight: 600, outline: 'none' }}
                  />
                </div>
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
              Simpan Perubahan
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

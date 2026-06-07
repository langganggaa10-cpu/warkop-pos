"use client";

import { User, Shield, Monitor, Bell, Database, Globe } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const settingsGroups = [
    {
      title: "Profil & Keamanan",
      items: [
        { icon: User, label: "Informasi Akun", desc: "Kelola nama, email, dan foto profil Anda", color: "#3B82F6", href: "/admin/settings/profile" },
        { icon: Shield, label: "Kata Sandi", desc: "Perbarui keamanan akun secara berkala", color: "#10B981", href: "/admin/settings/security" },
      ]
    },
    {
      title: "Sistem & Aplikasi",
      items: [
        { icon: Monitor, label: "Tampilan", desc: "Mode gelap, warna tema, dan tata letak", color: "#FFC107", href: "/admin/settings/appearance" },
        { icon: Bell, label: "Notifikasi", desc: "Atur pemberitahuan pesanan dan stok", color: "#F43F5E", href: "/admin/settings/notifications" },
        { icon: Database, label: "Database", desc: "Cadangkan dan pulihkan data transaksi", color: "#8B5CF6", href: "/admin/settings/database" },
        { icon: Globe, label: "Lokasi & Bahasa", desc: "Format mata uang dan zona waktu", color: "#06B6D4", href: "/admin/settings/localization" },
      ]
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* HEADER */}
      <div>
        <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>Pengaturan</h2>
        <p style={{ margin: '8px 0 0 0', fontSize: '15px', fontWeight: 600, color: '#64748B' }}>Konfigurasi sistem dan preferensi akun Anda</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        {settingsGroups.map((group, gIdx) => (
          <div key={gIdx} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', marginLeft: '8px' }}>
              {group.title}
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
              {group.items.map((item, iIdx) => (
                <Link 
                  key={iIdx} 
                  href={item.href}
                  style={{ 
                    backgroundColor: '#FFFFFF', 
                    padding: '24px', 
                    borderRadius: '24px', 
                    border: '1px solid #F1F5F9', 
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textDecoration: 'none'
                  }}
                  className="settings-card"
                >
                  <div style={{ 
                    width: '52px', 
                    height: '52px', 
                    backgroundColor: `${item.color}10`, 
                    color: item.color, 
                    borderRadius: '16px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>{item.label}</h4>
                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', fontWeight: 600, color: '#64748B' }}>{item.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

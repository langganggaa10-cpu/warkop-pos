import Link from "next/link";
import { Coffee, User, LayoutDashboard } from "lucide-react";

export default function Home() {
  return (
    <main 
      style={{ 
        minHeight: '100vh', 
        backgroundColor: '#F9FAFB', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}
    >
      <div 
        style={{ 
          backgroundColor: '#FFFFFF', 
          padding: '64px', 
          borderRadius: '48px', 
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)', 
          border: '1px solid #F1F5F9',
          textAlign: 'center',
          maxWidth: '500px',
          width: '100%'
        }}
      >
        <div 
          style={{ 
            width: '80px', 
            height: '80px', 
            backgroundColor: '#FFC107', 
            borderRadius: '24px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 32px auto',
            color: '#0F172A',
            boxShadow: '0 12px 24px -6px rgba(255, 193, 7, 0.4)'
          }}
        >
          <Coffee size={40} strokeWidth={2.5} />
        </div>

        <h1 style={{ fontSize: '36px', fontWeight: 900, color: '#0F172A', margin: '0 0 12px 0', letterSpacing: '-0.02em' }}>
          WARKOP<span style={{ color: '#FFC107' }}>POS</span>
        </h1>

        <p style={{ fontSize: '16px', fontWeight: 600, color: '#64748B', margin: '0 0 48px 0' }}>
          Sistem Kasir dan Manajemen Warkop Modern
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Link
            href="/login"
            style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              padding: '18px', 
              backgroundColor: '#0F172A', 
              color: '#FFFFFF', 
              borderRadius: '20px',
              textDecoration: 'none',
              fontWeight: 800,
              fontSize: '15px',
              transition: 'all 0.2s',
              boxShadow: '0 10px 20px -5px rgba(15, 23, 42, 0.3)'
            }}
          >
            <User size={20} />
            Masuk ke Sistem
          </Link>

          <Link
            href="/admin"
            style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              padding: '18px', 
              backgroundColor: '#FFFFFF', 
              color: '#0F172A', 
              borderRadius: '20px',
              textDecoration: 'none',
              fontWeight: 800,
              fontSize: '15px',
              border: '1px solid #F1F5F9',
              transition: 'all 0.2s',
              boxShadow: '0 4px 10px rgba(0,0,0,0.02)'
            }}
          >
            <LayoutDashboard size={20} />
            Dashboard Admin
          </Link>
        </div>

        <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid #F8FAFC' }}>
          <p style={{ margin: 0, fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Warkop POS v1.0 • 2026
          </p>
        </div>
      </div>
    </main>
  );
}
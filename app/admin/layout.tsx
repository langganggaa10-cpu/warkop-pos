"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Utensils, 
  ClipboardList, 
  Table as TableIcon, 
  Calculator, 
  Settings, 
  LogOut,
  User as UserIcon
} from "lucide-react";
import { logoutAction } from "@/app/auth/actions";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { name: "Menu", icon: Utensils, href: "/admin/menu" },
    { name: "Pesanan", icon: ClipboardList, href: "/admin/orders" },
    { name: "Meja", icon: TableIcon, href: "/admin/table" },
    { name: "Laporan", icon: Calculator, href: "/admin/reports" },
    { name: "Pengaturan", icon: Settings, href: "/admin/settings" },
  ];

  return (
    <div 
      className="min-h-screen flex font-sans"
      style={{ 
        backgroundColor: '#F9FAFB', 
        display: 'flex', 
        minHeight: '100vh',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}
    >
      {/* SIDEBAR */}
      <aside 
        className="w-72 flex flex-col fixed h-screen z-50"
        style={{ 
          width: '280px', 
          backgroundColor: '#0F172A', 
          position: 'fixed', 
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '4px 0 24px rgba(0,0,0,0.05)',
          zIndex: 100
        }}
      >
        {/* LOGO */}
        <div 
          className="p-10 flex items-center gap-4"
          style={{ padding: '40px 32px', display: 'flex', alignItems: 'center', gap: '12px' }}
        >
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xl"
            style={{ 
              width: '48px', 
              height: '48px', 
              backgroundColor: '#FFC107', 
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Utensils style={{ color: '#0F172A', width: '24px', height: '24px' }} />
          </div>
          <span 
            className="text-2xl font-black tracking-tight"
            style={{ 
              fontSize: '24px', 
              fontWeight: 900, 
              color: '#FFFFFF',
              letterSpacing: '-0.025em'
            }}
          >
            warkop<span style={{ color: '#FFC107' }}>pos</span>
          </span>
        </div>

        {/* MENU */}
        <nav 
          className="flex-1 px-6 space-y-2 mt-4"
          style={{ flex: 1, padding: '0 24px', display: 'flex', flexDirection: 'column', gap: '8px' }}
        >
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all group`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '14px 20px',
                  borderRadius: '16px',
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: '14px',
                  transition: 'all 0.2s ease',
                  backgroundColor: isActive ? '#1E293B' : 'transparent',
                  color: isActive ? '#FFC107' : '#94A3B8',
                  borderLeft: isActive ? '4px solid #FFC107' : '4px solid transparent',
                }}
              >
                <item.icon size={22} style={{ flexShrink: 0 }} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* FOOTER: PROFILE & LOGOUT */}
        <div 
          className="p-8 space-y-6"
          style={{ padding: '32px', borderTop: '1px solid #1E293B' }}
        >
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-[#1E293B] overflow-hidden bg-[#1E293B]"
              style={{ width: '48px', height: '48px', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <UserIcon style={{ color: '#94A3B8' }} size={24} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>Admin Warkop</p>
              <p style={{ margin: 0, fontSize: '10px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Manager</p>
            </div>
          </div>

          <form action={logoutAction}>
            <button 
              type="submit"
              className="flex items-center gap-4 px-5 py-4 w-full rounded-2xl font-bold transition-all"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px', 
                padding: '14px 20px', 
                width: '100%', 
                backgroundColor: 'transparent', 
                border: 'none',
                color: '#EF4444',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <LogOut size={22} />
              <span>Keluar Sistem</span>
            </button>
          </form>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main 
        className="flex-1 ml-72 p-12"
        style={{ 
          flex: 1, 
          marginLeft: '280px', 
          padding: '48px',
          minHeight: '100vh'
        }}
      >
        {children}
      </main>
    </div>
  );
}

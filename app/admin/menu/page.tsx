import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createMenu } from "./actions";
import DeleteButton from "./DeleteButton";
import { Utensils, Plus, Search, Filter, Edit3, Trash2, Package, Tag, Banknote, ShoppingBag } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const menus = await prisma.menu.findMany({
    orderBy: {
      id: "desc",
    },
  });

  const getCategoryColor = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('minum')) return { bg: '#EEF2FF', text: '#4F46E5', border: '#E0E7FF' };
    if (cat.includes('makan')) return { bg: '#FFF7ED', text: '#C2410C', border: '#FFEDD5' };
    if (cat.includes('cemil') || cat.includes('snack')) return { bg: '#F0FDF4', text: '#15803D', border: '#DCFCE7' };
    return { bg: '#F8FAFC', text: '#64748B', border: '#F1F5F9' };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', position: 'relative' }}>
      {/* HEADER */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        position: 'sticky',
        top: 0,
        backgroundColor: '#F9FAFB',
        padding: '12px 0',
        zIndex: 30,
        margin: '-12px 0'
      }}>
        <div>
          <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>Manajemen Menu</h2>
          <p style={{ margin: '8px 0 0 0', fontSize: '15px', fontWeight: 600, color: '#64748B' }}>Atur katalog makanan dan minuman Anda</p>
        </div>
        
        <div style={{ 
          backgroundColor: '#FFFFFF', 
          padding: '12px 24px', 
          borderRadius: '24px', 
          boxShadow: '0 4px 15px rgba(0,0,0,0.03)', 
          border: '1px solid #F1F5F9', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px'
        }}>
          <div style={{ 
            width: '44px', 
            height: '44px', 
            backgroundColor: '#FFC107', 
            borderRadius: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: '#0F172A'
          }}>
            <ShoppingBag size={22} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TOTAL MENU</p>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#0F172A' }}>{menus.length} <span style={{ color: '#64748B', fontWeight: 700, fontSize: '14px' }}>Produk</span></p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '40px' }}>
        {/* FORM TAMBAH MENU */}
        <div style={{ position: 'sticky', top: '48px', height: 'fit-content' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '48px', padding: '48px', border: '1px solid #F1F5F9', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
              <div style={{ width: '52px', height: '52px', backgroundColor: '#FFC107', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0F172A' }}>
                <Plus size={24} strokeWidth={3} />
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A', margin: 0 }}>Tambah Menu Baru</h3>
            </div>

            <form action={createMenu} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginLeft: '4px' }}>NAMA MENU</label>
                <div style={{ position: 'relative' }}>
                  <Utensils size={18} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#FFC107' }} />
                  <input
                    name="name"
                    placeholder="Contoh: Kopi Susu Gula Aren"
                    style={{ width: '100%', backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: '20px', padding: '18px 20px 18px 56px', fontSize: '14px', fontWeight: 600, outline: 'none' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginLeft: '4px' }}>HARGA (RP)</label>
                  <div style={{ position: 'relative' }}>
                    <Banknote size={18} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#10B981' }} />
                    <input
                      name="price"
                      type="number"
                      placeholder="15000"
                      style={{ width: '100%', backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: '20px', padding: '18px 20px 18px 56px', fontSize: '14px', fontWeight: 600, outline: 'none' }}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginLeft: '4px' }}>STOK</label>
                  <div style={{ position: 'relative' }}>
                    <Package size={18} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#3B82F6' }} />
                    <input
                      name="stock"
                      type="number"
                      placeholder="50"
                      style={{ width: '100%', backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: '20px', padding: '18px 20px 18px 56px', fontSize: '14px', fontWeight: 600, outline: 'none' }}
                      required
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginLeft: '4px' }}>KATEGORI</label>
                <div style={{ position: 'relative' }}>
                  <Tag size={18} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#8B5CF6' }} />
                  <input
                    name="category"
                    placeholder="Contoh: Minuman"
                    style={{ width: '100%', backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: '20px', padding: '18px 20px 18px 56px', fontSize: '14px', fontWeight: 600, outline: 'none' }}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{ 
                  width: '100%', 
                  marginTop: '16px', 
                  backgroundColor: '#FFC107', 
                  color: '#0F172A', 
                  padding: '20px', 
                  borderRadius: '24px', 
                  border: 'none', 
                  fontSize: '16px', 
                  fontWeight: 900, 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '12px',
                  boxShadow: '0 10px 20px -5px rgba(255, 193, 7, 0.4)'
                }}
              >
                <Plus size={20} strokeWidth={3} />
                Simpan ke Katalog
              </button>
            </form>
          </div>
        </div>

        {/* LIST MENU */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* SEARCH & FILTER */}
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={20} style={{ position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input 
                type="text"
                placeholder="Cari menu..."
                style={{ width: '100%', backgroundColor: '#FFFFFF', border: '1px solid #F1F5F9', borderRadius: '24px', padding: '18px 24px 18px 64px', fontSize: '15px', fontWeight: 600, color: '#0F172A', outline: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}
              />
            </div>
            <button style={{ padding: '0 32px', backgroundColor: '#FFFFFF', border: '1px solid #F1F5F9', borderRadius: '24px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
              <Filter size={20} />
              Filter
            </button>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '48px', border: '1px solid #F1F5F9', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #F8FAFC' }}>
                  <th style={{ padding: '32px 40px', fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>DETAIL MENU</th>
                  <th style={{ padding: '32px 40px', fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>KATEGORI</th>
                  <th style={{ padding: '32px 40px', fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>STOK</th>
                  <th style={{ padding: '32px 40px', fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>HARGA</th>
                  <th style={{ padding: '32px 40px', fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>AKSI</th>
                </tr>
              </thead>
              <tbody>
                {menus.map((menu) => {
                  const catColor = getCategoryColor(menu.category);
                  return (
                    <tr key={menu.id} style={{ borderBottom: '1px solid #F8FAFC' }}>
                      <td style={{ padding: '24px 40px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                          <div style={{ 
                            width: '56px', 
                            height: '56px', 
                            backgroundColor: catColor.bg, 
                            borderRadius: '18px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            fontSize: '22px', 
                            fontWeight: 900, 
                            color: catColor.text
                          }}>
                            {menu.name.charAt(0)}
                          </div>
                          <div>
                            <p style={{ margin: 0, fontSize: '16px', fontWeight: 900, color: '#0F172A' }}>{menu.name}</p>
                            <p style={{ margin: '4px 0 0 0', fontSize: '11px', fontWeight: 700, color: '#94A3B8' }}>ID: #{menu.id}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '24px 40px' }}>
                        <span style={{ 
                          padding: '8px 16px', 
                          backgroundColor: catColor.bg, 
                          borderRadius: '12px', 
                          fontSize: '11px', 
                          fontWeight: 900, 
                          color: catColor.text, 
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}>
                          {menu.category}
                        </span>
                      </td>
                      <td style={{ padding: '24px 40px' }}>
                        <div style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '10px',
                          padding: '8px 16px',
                          backgroundColor: menu.stock > 10 ? '#F0FDF4' : '#FEF2F2',
                          borderRadius: '12px'
                        }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: menu.stock > 10 ? '#22C55E' : '#EF4444' }}></div>
                          <span style={{ fontSize: '13px', fontWeight: 900, color: menu.stock > 10 ? '#15803D' : '#B91C1C' }}>{menu.stock} unit</span>
                        </div>
                      </td>
                      <td style={{ padding: '24px 40px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <span style={{ fontSize: '12px', fontWeight: 800, color: '#94A3B8', marginBottom: '4px' }}>Rp</span>
                          <span style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A' }}>{menu.price.toLocaleString("id-ID")}</span>
                        </div>
                      </td>
                      <td style={{ padding: '24px 40px' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                          <Link
                            href={`/admin/menu/${menu.id}`}
                            style={{ 
                              width: '44px', 
                              height: '44px', 
                              backgroundColor: '#EFF6FF', 
                              color: '#2563EB', 
                              borderRadius: '14px', 
                              border: 'none', 
                              cursor: 'pointer', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              boxShadow: '0 4px 10px rgba(37, 99, 235, 0.1)'
                            }}
                          >
                            <Edit3 size={20} />
                          </Link>
                          <DeleteButton id={menu.id} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {menus.length === 0 && (
              <div style={{ padding: '100px', textAlign: 'center' }}>
                <Utensils size={64} style={{ color: '#E2E8F0', marginBottom: '24px' }} />
                <p style={{ fontSize: '16px', fontWeight: 800, color: '#94A3B8' }}>Belum ada menu dalam katalog</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

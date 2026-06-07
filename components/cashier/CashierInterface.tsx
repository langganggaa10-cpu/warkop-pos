"use client";

import { useState, useMemo } from "react";
import { processCheckout, clearTable, type CartItem } from "@/app/dashboard/kasir/actions";
import { Search, Filter, ShoppingBag, Trash2, Plus, Minus, CheckCircle2, Coffee, Utensils, X, Eraser } from "lucide-react";

interface Menu {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
}

interface Table {
  id: number;
  number: number;
  isActive: boolean;
  isOccupied: boolean;
}

interface CashierInterfaceProps {
  menus: Menu[];
  tables: Table[];
  occupiedTableIds: number[];
}

export default function CashierInterface({ menus, tables, occupiedTableIds }: CashierInterfaceProps) {
  const [selectedTableId, setSelectedTableId] = useState<number | "">("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = useMemo(() => {
    const cats = ["Semua", ...new Set(menus.map((m: any) => m.category))];
    return cats;
  }, [menus]);

  const filteredMenus = useMemo(() => {
    return menus.filter((menu) => {
      const matchesSearch = menu.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "Semua" || menu.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [menus, searchQuery, selectedCategory]);

  const addToCart = (menu: Menu) => {
    if (menu.stock <= 0) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === menu.id);
      if (existing) {
        if (existing.quantity >= menu.stock) {
          alert("Stok tidak mencukupi");
          return prev;
        }
        return prev.map((item) =>
          item.id === menu.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id: menu.id, name: menu.name, price: menu.price, quantity: 1 }];
    });
  };

  const updateCartQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          const menu = menus.find((m) => m.id === id);
          if (newQty > (menu?.stock || 0)) {
            alert("Stok tidak mencukupi");
            return item;
          }
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      }).filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!selectedTableId) {
      alert("Silakan pilih meja terlebih dahulu");
      return;
    }
    if (cart.length === 0) {
      alert("Keranjang masih kosong");
      return;
    }

    setIsSubmitting(true);
    const result = await processCheckout(Number(selectedTableId), cart, total);
    setIsSubmitting(false);

    if (result.success) {
      alert("Pesanan berhasil dibuat!");
      setCart([]);
      setSelectedTableId("");
      window.location.reload();
    } else {
      alert(result.error);
    }
  };

  const handleClearTable = async (tableId: number) => {
    if (!confirm("Kosongkan meja ini? Pastikan pelanggan sudah selesai makan.")) return;
    
    setIsSubmitting(true);
    const result = await clearTable(tableId);
    setIsSubmitting(false);

    if (result.success) {
      if (selectedTableId === tableId) setSelectedTableId("");
      window.location.reload();
    } else {
      alert(result.error);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '32px', height: 'calc(100vh - 280px)' }}>
      {/* LEFT SECTION: MENU & TABLES */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto', paddingRight: '8px' }}>
        
        {/* TABLE SELECTION */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '32px', border: '1px solid #F1F5F9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ width: '6px', height: '20px', backgroundColor: '#FFC107', borderRadius: '4px' }}></div>
            <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#0F172A', margin: 0 }}>Pilih Meja (Hijau = Kosong, Merah = Terisi)</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))', gap: '12px' }}>
            {tables.map((table) => {
              const isOccupied = occupiedTableIds.includes(table.id) || table.isOccupied;
              return (
                <button
                  key={table.id}
                  onClick={() => setSelectedTableId(table.id)}
                  style={{
                    aspectRatio: '1/1',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '14px',
                    fontSize: '14px',
                    fontWeight: 900,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    position: 'relative',
                    backgroundColor: selectedTableId === table.id 
                      ? '#0F172A' 
                      : isOccupied 
                        ? '#EF4444' 
                        : '#10B981',
                    color: selectedTableId === table.id 
                      ? '#FFFFFF' 
                      : '#FFFFFF',
                    border: `2px solid ${
                      selectedTableId === table.id 
                        ? '#0F172A' 
                        : isOccupied 
                          ? '#DC2626' 
                          : '#059669'
                    }`,
                    boxShadow: selectedTableId === table.id 
                      ? '0 8px 16px -4px rgba(15, 23, 42, 0.25)' 
                      : isOccupied
                        ? '0 4px 12px -2px rgba(239, 68, 68, 0.3)'
                        : '0 4px 12px -2px rgba(16, 185, 129, 0.2)'
                  }}
                >
                  <span>{table.number}</span>
                  {isOccupied && selectedTableId !== table.id && (
                    <span style={{ fontSize: '9px', fontWeight: 900, marginTop: '2px', textTransform: 'uppercase', opacity: 0.9 }}>ISI</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* FILTERS & SEARCH */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '32px', border: '1px solid #F1F5F9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type="text"
              placeholder="Cari menu favorit pelanggan..."
              style={{ width: '100%', backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: '16px', padding: '14px 20px 14px 52px', fontSize: '14px', fontWeight: 600, color: '#0F172A', outline: 'none' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '4px' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '12px 20px',
                  borderRadius: '14px',
                  fontSize: '12px',
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                  backgroundColor: selectedCategory === cat ? '#0F172A' : '#FFFFFF',
                  color: selectedCategory === cat ? '#FFFFFF' : '#64748B',
                  boxShadow: selectedCategory === cat ? '0 8px 16px -4px rgba(15, 23, 42, 0.25)' : '0 1px 3px rgba(0,0,0,0.02)',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: selectedCategory === cat ? '#0F172A' : '#F1F5F9'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* MENU GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
          {filteredMenus.map((menu) => (
            <div
              key={menu.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '32px',
                padding: '24px',
                border: '1px solid #F1F5F9',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                opacity: menu.stock <= 0 ? 0.6 : 1,
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s'
              }}
            >
              <div style={{ marginBottom: '16px' }}>
                <span style={{ padding: '6px 12px', backgroundColor: '#EFF6FF', color: '#1D4ED8', borderRadius: '10px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {menu.category}
                </span>
                <h4 style={{ margin: '12px 0 4px 0', fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>{menu.name}</h4>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A' }}>Rp {menu.price.toLocaleString("id-ID")}</div>
              </div>
              
              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: menu.stock < 5 ? '#EF4444' : '#22C55E' }}></div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8' }}>Stok: {menu.stock}</span>
                </div>
                <button
                  onClick={() => addToCart(menu)}
                  disabled={menu.stock <= 0}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: menu.stock <= 0 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    backgroundColor: menu.stock <= 0 ? '#F1F5F9' : '#0F172A',
                    color: menu.stock <= 0 ? '#94A3B8' : '#FFFFFF',
                    border: 'none',
                    boxShadow: menu.stock <= 0 ? 'none' : '0 4px 12px -2px rgba(15, 23, 42, 0.2)'
                  }}
                >
                  {menu.stock <= 0 ? "Habis" : "Tambah"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SECTION: CART SIDEBAR */}
      <div style={{ width: '400px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ 
          backgroundColor: '#FFFFFF', 
          borderRadius: '40px', 
          border: '1px solid #F1F5F9', 
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '32px', borderBottom: '1px solid #F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 900, color: '#0F172A' }}>Keranjang</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', fontWeight: 700, color: '#94A3B8' }}>{cart.length} item dipilih</p>
            </div>
            {selectedTableId && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                <div style={{ padding: '8px 16px', backgroundColor: '#F0FDF4', color: '#15803D', borderRadius: '12px', fontSize: '12px', fontWeight: 800, border: '1px solid #DCFCE7' }}>
                  Meja {tables.find(t => t.id === selectedTableId)?.number}
                </div>
                {tables.find(t => t.id === selectedTableId)?.isOccupied && (
                  <button
                    onClick={() => handleClearTable(Number(selectedTableId))}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#FEF2F2',
                      color: '#EF4444',
                      borderRadius: '10px',
                      fontSize: '10px',
                      fontWeight: 800,
                      border: '1px solid #FEE2E2',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Eraser size={12} />
                    Kosongkan Meja
                  </button>
                )}
              </div>
            )}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {cart.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.3 }}>
                <ShoppingBag size={64} style={{ color: '#94A3B8', marginBottom: '16px' }} />
                <p style={{ fontSize: '14px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Belum ada item</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} style={{ display: 'flex', gap: '16px', padding: '20px', backgroundColor: '#F8FAFC', borderRadius: '24px', border: '1px solid #F1F5F9' }}>
                  <div style={{ flex: 1 }}>
                    <h5 style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>{item.name}</h5>
                    <p style={{ margin: '4px 0 0 0', fontSize: '12px', fontWeight: 700, color: '#1D4ED8' }}>Rp {item.price.toLocaleString("id-ID")}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    <button onClick={() => removeFromCart(item.id)} style={{ padding: '4px', backgroundColor: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer' }}>
                      <X size={16} />
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#FFFFFF', padding: '4px 8px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                      <button onClick={() => updateCartQuantity(item.id, -1)} style={{ backgroundColor: 'transparent', border: 'none', color: '#0F172A', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Minus size={14} /></button>
                      <span style={{ fontSize: '13px', fontWeight: 900, minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                      <button onClick={() => updateCartQuantity(item.id, 1)} style={{ backgroundColor: 'transparent', border: 'none', color: '#0F172A', cursor: 'pointer', display: 'flex', alignItems: 'center' }}><Plus size={14} /></button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={{ padding: '32px', backgroundColor: '#F8FAFC', borderTop: '1px solid #F1F5F9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
              <div>
                <p style={{ margin: 0, fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Tagihan</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '32px', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.03em' }}>
                  Rp {total.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              disabled={isSubmitting || cart.length === 0 || !selectedTableId}
              style={{
                width: '100%',
                padding: '20px',
                borderRadius: '20px',
                fontSize: '15px',
                fontWeight: 900,
                cursor: (isSubmitting || cart.length === 0 || !selectedTableId) ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                backgroundColor: (isSubmitting || cart.length === 0 || !selectedTableId) ? '#E2E8F0' : '#FFC107',
                color: (isSubmitting || cart.length === 0 || !selectedTableId) ? '#94A3B8' : '#0F172A',
                border: 'none',
                boxShadow: (isSubmitting || cart.length === 0 || !selectedTableId) ? 'none' : '0 12px 24px -6px rgba(255, 193, 7, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px'
              }}
            >
              {isSubmitting ? "MEMPROSES..." : (
                <>
                  <CheckCircle2 size={20} />
                  KONFIRMASI PESANAN
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

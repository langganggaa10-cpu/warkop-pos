"use client";

import { useState, useMemo } from "react";
import { saveOrder } from "./actions";

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
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function CashierClient({ 
  initialMenus, 
  initialTables 
}: { 
  initialMenus: Menu[]; 
  initialTables: Table[] 
}) {
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter menu berdasarkan stok yang ada (opsional, tapi bagus untuk UX)
  const menus = useMemo(() => initialMenus, [initialMenus]);

  const addToCart = (menu: Menu) => {
    if (menu.stock <= 0) {
      alert("Stok menu ini sudah habis!");
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.id === menu.id);
      if (existing) {
        if (existing.quantity >= menu.stock) {
          alert("Batas stok tercapai!");
          return prev;
        }
        return prev.map((item) =>
          item.id === menu.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id: menu.id, name: menu.name, price: menu.price, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          const menu = menus.find((m) => m.id === id);
          if (newQty > (menu?.stock || 0)) {
            alert("Batas stok tercapai!");
            return item;
          }
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      })
    );
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const totalHarga = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItem = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = async () => {
    if (!selectedTable) return alert("Silakan pilih meja terlebih dahulu!");
    if (cart.length === 0) return alert("Keranjang masih kosong!");

    setIsSubmitting(true);
    const result = await saveOrder(
      selectedTable.id,
      cart.map(item => ({ menuId: item.id, quantity: item.quantity, price: item.price })),
      totalHarga
    );
    setIsSubmitting(false);

    if (result.success) {
      alert("Pesanan berhasil disimpan!");
      setCart([]);
      setSelectedTable(null);
      window.location.reload();
    } else {
      alert("Error: " + result.error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-black text-blue-600">WARKOP<span className="text-gray-800">POS</span></h1>
          {selectedTable && (
            <div className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full font-bold">
              Meja {selectedTable.number}
            </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto w-full p-4 flex flex-col lg:flex-row gap-6">
        {/* KIRI: PEMILIHAN MEJA & MENU */}
        <div className="flex-1 space-y-6">
          {!selectedTable ? (
            /* STEP 1: PILIH MEJA */
            <section className="bg-white p-6 rounded-2xl shadow-sm border">
              <h2 className="text-xl font-bold mb-6 text-gray-800">Pilih Meja Aktif</h2>
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {initialTables.map((table) => (
                  <button
                    key={table.id}
                    onClick={() => setSelectedTable(table)}
                    className="aspect-square flex flex-col items-center justify-center rounded-2xl border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-all group"
                  >
                    <span className="text-3xl font-black text-gray-400 group-hover:text-blue-600">{table.number}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Meja</span>
                  </button>
                ))}
              </div>
            </section>
          ) : (
            /* STEP 2: PILIH MENU */
            <section className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Daftar Menu</h2>
                <button 
                  onClick={() => setSelectedTable(null)}
                  className="text-sm font-bold text-blue-600 hover:underline"
                >
                  &larr; Ganti Meja
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {menus.map((menu: any) => (
                  <div key={menu.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
                    <div className="flex-1">
                      <div className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter mb-1">{menu.category}</div>
                      <h3 className="font-bold text-gray-800 mb-1">{menu.name}</h3>
                      <div className="text-blue-600 font-black">Rp {menu.price.toLocaleString()}</div>
                      <div className={`text-[10px] mt-2 font-bold ${menu.stock < 5 ? 'text-red-500' : 'text-gray-400'}`}>
                        Stok: {menu.stock}
                      </div>
                    </div>
                    <button
                      onClick={() => addToCart(menu)}
                      disabled={menu.stock <= 0}
                      className={`mt-4 w-full py-2 rounded-xl font-bold text-sm transition-all ${
                        menu.stock <= 0 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                      }`}
                    >
                      {menu.stock <= 0 ? 'Habis' : '+ Tambah'}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* KANAN: KERANJANG (STICKY) */}
        <div className="w-full lg:w-96">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col h-[calc(100vh-120px)] sticky top-24">
            <div className="p-6 border-b">
              <h3 className="text-lg font-black text-gray-800">Keranjang Pesanan</h3>
              {selectedTable && <p className="text-xs text-gray-400 font-bold mt-1">MEJA {selectedTable.number}</p>}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-300 opacity-50">
                  <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <p className="font-bold text-sm uppercase tracking-widest">Kosong</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-sm text-gray-800 leading-tight">{item.name}</span>
                      <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-xs font-bold text-blue-600">Rp {item.price.toLocaleString()}</div>
                      <div className="flex items-center gap-3 bg-white px-2 py-1 rounded-lg border">
                        <button onClick={() => updateQuantity(item.id, -1)} className="text-blue-600 font-black">-</button>
                        <span className="text-xs font-black w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="text-blue-600 font-black">+</button>
                      </div>
                    </div>
                    <div className="text-[10px] text-right font-bold text-gray-400">
                      Subtotal: Rp {(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 bg-gray-50 rounded-b-2xl border-t border-gray-100">
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm font-bold text-gray-500">
                  <span>Total Item</span>
                  <span>{totalItem}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-800 font-black">Total Harga</span>
                  <span className="text-2xl font-black text-blue-600">Rp {totalHarga.toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                disabled={isSubmitting || cart.length === 0 || !selectedTable}
                className={`w-full py-4 rounded-2xl font-black text-lg shadow-lg transition-all ${
                  isSubmitting || cart.length === 0 || !selectedTable
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100 active:scale-95'
                }`}
              >
                {isSubmitting ? 'Memproses...' : 'SIMPAN PESANAN'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

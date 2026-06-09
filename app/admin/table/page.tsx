import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createTable } from "./actions";
import DeleteTableButton from "./DeleteTableButton";
import ToggleTableButton from "./ToggleTableButton";
import ClearTableButton from "./ClearTableButton";
import { Table as TableIcon, Plus, Edit3, Users, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TablePage() {
  const tables = await prisma.table.findMany({ orderBy: { number: "asc" } });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>Pengaturan Meja</h2>
          <p style={{ margin: '8px 0 0 0', fontSize: '14px', fontWeight: 600, color: '#64748B' }}>Kelola ruang fisik warkop Anda</p>
        </div>
        
        <div style={{ backgroundColor: '#FFFFFF', padding: '16px 24px', borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '44px', height: '44px', backgroundColor: '#EFF6FF', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1D4ED8' }}>
            <TableIcon size={22} style={{ margin: 'auto' }} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Meja</p>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>{tables.length} Slot</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '40px' }}>
        {/* FORM TAMBAH MEJA */}
        <div style={{ position: 'sticky', top: '48px', height: 'fit-content' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '40px', padding: '40px', border: '1px solid #F1F5F9', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: '#FFC107', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0F172A', boxShadow: '0 8px 16px -4px rgba(255, 193, 7, 0.4)' }}>
                <Plus size={24} strokeWidth={3} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A', margin: 0 }}>Tambah Meja</h3>
            </div>

            <form action={createTable} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '10px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginLeft: '4px' }}>Nomor Meja</label>
                <div style={{ position: 'relative' }}>
                  <TableIcon size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#CBD5E1' }} />
                  <input
                    name="number"
                    type="number"
                    placeholder="Contoh: 15"
                    style={{ width: '100%', backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: '16px', padding: '14px 16px 14px 48px', fontSize: '14px', fontWeight: 600, outline: 'none' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '16px', cursor: 'pointer' }}>
                <input
                  name="isActive"
                  type="checkbox"
                  id="isActive"
                  defaultChecked
                  style={{ width: '20px', height: '20px', borderRadius: '6px', cursor: 'pointer' }}
                />
                <label htmlFor="isActive" style={{ fontSize: '14px', fontWeight: 700, color: '#334155', cursor: 'pointer' }}>Tersedia untuk Pelanggan</label>
              </div>

              <button
                type="submit"
                style={{ width: '100%', marginTop: '16px', backgroundColor: '#0F172A', color: '#FFFFFF', padding: '18px', borderRadius: '18px', border: 'none', fontSize: '14px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', boxShadow: '0 10px 20px -5px rgba(15, 23, 42, 0.3)' }}
              >
                <Plus size={20} strokeWidth={3} />
                Konfirmasi Meja
              </button>
            </form>
          </div>
        </div>

        {/* GRID MEJA */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {tables.map((table) => (
            <div key={table.id} style={{ 
              backgroundColor: '#FFFFFF', 
              borderRadius: '40px', 
              padding: '32px', 
              border: '1px solid #F1F5F9', 
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.03)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ 
                  width: '64px', 
                  height: '64px', 
                  backgroundColor: table.isActive ? '#0F172A' : '#F1F5F9', 
                  color: table.isActive ? '#FFFFFF' : '#CBD5E1', 
                  borderRadius: '20px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '24px', 
                  fontWeight: 900,
                  boxShadow: table.isActive ? '0 10px 20px -5px rgba(15, 23, 42, 0.3)' : 'none'
                }}>
                  {table.number}
                </div>
                <ToggleTableButton id={table.id} isActive={table.isActive} />
              </div>

              <div>
                <h4 style={{ margin: 0, fontSize: '20px', fontWeight: 900, color: '#0F172A' }}>Meja {table.number}</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                  <p style={{ margin: 0, fontSize: '12px', fontWeight: 700, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Users size={14} /> Kapasitas Standar
                  </p>
                  {(table as any).isOccupied && (
                    <p style={{ margin: 0, fontSize: '11px', fontWeight: 800, color: '#EF4444', display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#FEF2F2', padding: '4px 10px', borderRadius: '8px', width: 'fit-content' }}>
                      <AlertCircle size={14} /> SEDANG TERISI
                    </p>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: 'auto', paddingTop: '20px', borderTop: '1px dashed #F1F5F9' }}>
                <ClearTableButton id={table.id} isOccupied={(table as any).isOccupied} />
                <Link
                  href={`/admin/table/${table.id}`}
                  style={{ flex: 1, padding: '12px', backgroundColor: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: '14px', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '12px', fontWeight: 800, textDecoration: 'none' }}
                >
                  <Edit3 size={16} />
                  Ubah
                </Link>
                <DeleteTableButton id={table.id} />
              </div>
            </div>
          ))}

          {tables.length === 0 && (
            <div style={{ gridColumn: '1 / -1', padding: '80px', textAlign: 'center', backgroundColor: '#FFFFFF', borderRadius: '40px', border: '2px dashed #E2E8F0' }}>
              <TableIcon size={48} style={{ color: '#E2E8F0', marginBottom: '16px' }} />
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#94A3B8' }}>Belum ada meja yang terdaftar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

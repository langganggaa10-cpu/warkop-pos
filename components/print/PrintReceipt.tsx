"use client";

import { useRef } from "react";
import { Printer } from "lucide-react";

interface PrintReceiptProps {
  order: any;
  payment?: any;
}

export default function PrintReceipt({ order, payment }: PrintReceiptProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = printRef.current;
    const windowPrint = window.open('', '', 'width=400,height=600');
    
    if (windowPrint && printContent) {
      windowPrint.document.write(`
        <html>
          <head>
            <title>Cetak Struk - Order #${order.id}</title>
            <style>
              @page { margin: 0; }
              body { 
                font-family: 'Courier New', Courier, monospace; 
                width: 80mm; 
                padding: 20px;
                font-size: 12px;
                color: #000;
              }
              .center { text-align: center; }
              .bold { font-weight: bold; }
              .line { border-top: 1px dashed #000; margin: 10px 0; }
              .flex { display: flex; justify-content: space-between; }
              .mt-20 { margin-top: 20px; }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
            <script>
              window.onload = function() {
                window.print();
                window.close();
              }
            </script>
          </body>
        </html>
      `);
      windowPrint.document.close();
    }
  };

  return (
    <>
      {/* Visual Button */}
      <button 
        onClick={handlePrint}
        style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', 
          padding: '16px', backgroundColor: '#FFFFFF', color: '#0F172A', fontWeight: 800, 
          borderRadius: '16px', border: '1px solid #E2E8F0', cursor: 'pointer', width: '100%' 
        }}
      >
        <Printer size={20} /> CETAK STRUK
      </button>

      {/* Hidden Receipt Structure for Printing */}
      <div ref={printRef} style={{ display: 'none' }}>
        <div className="center bold" style={{ fontSize: '16px' }}>WARKOP POS</div>
        <div className="center">Sistem Kasir Modern</div>
        <div className="line"></div>
        
        <div className="flex">
          <span>Order: #${order.id}</span>
          <span>Meja: ${order.table.number}</span>
        </div>
        <div>Tgl: ${new Date(order.createdAt).toLocaleString("id-ID")}</div>
        <div className="line"></div>

        {order.items.map((item: any) => (
          <div key={item.id} style={{ marginBottom: '5px' }}>
            <div>${item.menu.name}</div>
            <div className="flex">
              <span>${item.quantity} x Rp ${Number(item.price).toLocaleString("id-ID")}</span>
              <span className="bold">Rp ${(item.quantity * Number(item.price)).toLocaleString("id-ID")}</span>
            </div>
          </div>
        ))}

        <div className="line"></div>
        <div className="flex bold">
          <span>TOTAL</span>
          <span>Rp ${Number(order.total).toLocaleString("id-ID")}</span>
        </div>

        {payment && (
          <>
            <div className="flex">
              <span>BAYAR (${payment.method})</span>
              <span>Rp ${Number(payment.paidAmount).toLocaleString("id-ID")}</span>
            </div>
            <div className="flex">
              <span>KEMBALI</span>
              <span>Rp ${Number(payment.change).toLocaleString("id-ID")}</span>
            </div>
          </>
        )}

        <div className="line"></div>
        <div className="center mt-20">Terima Kasih</div>
        <div className="center">Selamat Menikmati!</div>
      </div>
    </>
  );
}

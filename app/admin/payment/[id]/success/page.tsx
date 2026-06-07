import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface PaymentSuccessPageProps {
  params: Promise<{ id: string }>;
}

export default async function PaymentSuccessPage({ params }: PaymentSuccessPageProps) {
  const { id } = await params;
  const orderId = Number(id);

  const payment = await prisma.payment.findUnique({
    where: { orderId: orderId },
    include: {
      order: {
        include: {
          table: true,
        },
      },
    },
  });

  if (!payment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-3xl shadow-xl border border-gray-100 max-w-sm w-full">
          <h1 className="text-xl font-black text-gray-800 mb-4">Pembayaran tidak ditemukan</h1>
          <Link href="/admin/orders" className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold inline-block">Kembali ke Riwayat</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-green-600 flex items-center justify-center p-4 md:p-8">
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="p-10 text-center space-y-6">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Pembayaran Berhasil</h1>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1 italic">Transaksi telah selesai diproses</p>
          </div>

          <div className="bg-gray-50 rounded-3xl p-8 space-y-4 border border-gray-100">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Order ID</span>
              <span className="text-gray-800 font-black">#{payment.orderId}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Nomor Meja</span>
              <span className="text-gray-800 font-black text-lg">Meja {payment.order.table.number}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Metode</span>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">{payment.method}</span>
            </div>
            <div className="pt-4 border-t border-dashed border-gray-200 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-bold text-xs">Total</span>
                <span className="text-gray-800 font-black">Rp {Number(payment.total).toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-bold text-xs">Dibayar</span>
                <span className="text-gray-800 font-black">Rp {Number(payment.paidAmount).toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-gray-900 font-black uppercase tracking-widest text-[10px]">Kembalian</span>
                <span className="text-2xl font-black text-green-600">Rp {Number(payment.change).toLocaleString("id-ID")}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 pt-4">
            <button 
              onClick={() => window.print()}
              className="w-full py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-black transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Cetak Struk
            </button>
            <Link 
              href="/admin/orders" 
              className="w-full py-4 bg-gray-100 text-gray-600 font-black rounded-2xl hover:bg-gray-200 transition-all active:scale-95 uppercase tracking-widest text-xs inline-block"
            >
              Kembali ke Riwayat
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

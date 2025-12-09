import React from 'react';
import { User, Mail, Hash, Star, ArrowLeft } from 'lucide-react';

function ProfilePage({ userInfo, pastOrders, onGoBack }) {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* Üst Header */}
      <div className="bg-rose-900 text-white p-6 pt-10 rounded-b-[3rem] shadow-lg mb-6 relative">
        <button onClick={onGoBack} className="absolute top-6 left-4 p-2 bg-rose-800/50 rounded-full hover:bg-rose-700 transition">
          <ArrowLeft size={20} />
        </button>
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-white text-rose-900 rounded-full flex items-center justify-center text-4xl font-bold border-4 border-rose-200 mb-4 shadow-md">
            {userInfo.name.charAt(0)}
          </div>
          <h1 className="text-2xl font-bold">{userInfo.name}</h1>
          <span className="text-rose-200 text-sm bg-rose-800 px-3 py-1 rounded-full mt-1">
            {userInfo.role === 'student' ? 'Öğrenci' : 'Personel'}
          </span>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-lg">
        
        {/* Bilgi Kartı */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 space-y-3">
          <div className="flex items-center gap-3 text-gray-700">
            <div className="bg-gray-100 p-2 rounded-lg"><Mail size={18} /></div>
            <div>
              <p className="text-xs text-gray-400">E-Posta</p>
              <p className="font-medium">{userInfo.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-gray-700 border-t pt-3">
            <div className="bg-gray-100 p-2 rounded-lg"><Hash size={18} /></div>
            <div>
              <p className="text-xs text-gray-400">Öğrenci Numarası</p>
              <p className="font-medium">{userInfo.studentId}</p>
            </div>
          </div>
        </div>

        {/* Geçmiş Siparişler */}
        <h2 className="text-lg font-bold text-gray-800 mb-4 pl-1">Geçmiş Siparişler</h2>
        
        {pastOrders.length === 0 ? (
          <div className="text-center py-10 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-300">
            <p>Henüz tamamlanmış siparişin yok.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pastOrders.map((order) => (
              <div key={order.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 opacity-90 hover:opacity-100 transition">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-xs text-gray-400">{order.date}</span>
                    <h3 className="font-bold text-gray-800">Sipariş #{order.id}</h3>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg text-xs font-bold border border-yellow-100">
                    {order.rating} <Star size={12} fill="#B45309" stroke="none"/>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                  {order.items.map(i => i.name).join(", ")}
                </p>
                <div className="flex justify-between items-center text-sm border-t pt-2 mt-2">
                  <span className="text-green-600 font-bold">Teslim Edildi</span>
                  <span className="font-bold text-gray-900">{order.totalAmount}₺</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default ProfilePage;
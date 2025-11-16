import React, { useState } from 'react';
import { LogOut, QrCode, DollarSign, AlertCircle, Calendar } from 'lucide-react';
import QRGenerator from './QRGenerator';
import ComplaintSystem from './ComplaintSystem';
import PaymentSystem from './PaymentSystem';
import MealBooking from './MealBooking';

export default function StudentDashboard({ user, onLogout, updateStudent, students, mealLocked }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showQRCode, setShowQRCode] = useState(false);

  const mealRates = {
    breakfast: 30,
    lunch: 60,
    dinner: 40
  };

  const calculateDailyFee = (breakfast, lunch, dinner) => {
    let total = 0;
    if (breakfast) total += mealRates.breakfast;
    if (lunch) total += mealRates.lunch;
    if (dinner) total += mealRates.dinner;
    return total;
  };

  const dailyFee = calculateDailyFee(user.breakfast, user.lunch, user.dinner);

  const handleMealUpdate = (mealType, value) => {
    if (mealLocked) {
      alert('Meal subscriptions are currently locked. Please contact admin to unlock.');
      return;
    }
    updateStudent(user.id, { [mealType]: value });
  };

  const addComplaint = (complaint) => {
    const newComplaint = {
      id: Date.now(),
      ...complaint,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    updateStudent(user.id, {
      complaints: [...user.complaints, newComplaint]
    });
  };

  const addPayment = (payment) => {
    const newPayment = {
      id: Date.now(),
      ...payment,
      status: 'completed',
      createdAt: new Date().toISOString()
    };
    
    updateStudent(user.id, {
      payments: [...user.payments, newPayment],
      tokens: user.tokens + payment.tokens,
      totalSpent: user.totalSpent + payment.amount
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {showQRCode && <QRGenerator student={user} onClose={() => setShowQRCode(false)} />}
      
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Mess Management</h1>
              <p className="text-indigo-100">Student Dashboard</p>
              <p className="text-indigo-100 flex items-center gap-2 mt-1 text-sm">
                <Calendar size={14} />
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded font-semibold"
            >
              <LogOut size={20} /> Logout
            </button>
          </div>

          <div className="bg-gray-100 px-6 py-3 flex gap-4 border-b overflow-x-auto">
            {['dashboard', 'meals', 'qr', 'complaints', 'payments'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-semibold rounded whitespace-nowrap ${
                  activeTab === tab ? 'bg-white text-indigo-600' : 'text-gray-600'
                }`}
              >
                {tab === 'dashboard' && 'Dashboard'}
                {tab === 'meals' && 'Meal Booking'}
                {tab === 'qr' && 'My QR Code'}
                {tab === 'complaints' && 'Complaints'}
                {tab === 'payments' && 'Payments'}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300">
                    <p className="text-gray-600 text-sm">Available Tokens</p>
                    <p className="text-3xl font-bold text-green-600">{user.tokens}</p>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-300">
                    <p className="text-gray-600 text-sm">Daily Fee</p>
                    <p className="text-3xl font-bold text-blue-600">₹{dailyFee}</p>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-300">
                    <p className="text-gray-600 text-sm">Total Spent</p>
                    <p className="text-3xl font-bold text-purple-600">₹{user.totalSpent}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h2 className="text-xl font-bold text-gray-800 mb-3">Student Info</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <p><strong>ID:</strong> {user.id}</p>
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Room:</strong> <span className="font-semibold text-indigo-600">{user.room || 'Not Allocated'}</span></p>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-6 border-2 border-green-300">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Fee Calculation</h2>
                  <p className="text-gray-700"><strong>Daily Fee:</strong> ₹{dailyFee}</p>
                  <p className="text-gray-700"><strong>Monthly Fee (30 days):</strong> ₹{dailyFee * 30}</p>
                </div>
              </div>
            )}

            {activeTab === 'meals' && (
              <>
                {mealLocked && (
                  <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-4">
                    <p className="text-yellow-800 font-semibold">
                      ⚠️ Meal subscriptions are currently locked. You cannot modify your meal plans at this time.
                    </p>
                  </div>
                )}
                <MealBooking 
                  user={user}
                  mealRates={mealRates}
                  onMealUpdate={handleMealUpdate}
                  calculateDailyFee={calculateDailyFee}
                  mealLocked={mealLocked}
                />
              </>
            )}

            {activeTab === 'qr' && (
              <div className="text-center space-y-6">
                <h2 className="text-2xl font-bold text-gray-800">My QR Code</h2>
                <p className="text-gray-600">Show this QR code at the mess counter to redeem tokens</p>
                
                <div className="bg-white p-6 rounded-lg border-2 border-indigo-300 inline-block">
                  <QRGenerator student={user} showOnly={true} />
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="font-semibold text-blue-800">Student ID: {user.id}</p>
                  <p className="text-blue-600">Tokens Available: {user.tokens}</p>
                </div>
              </div>
            )}

            {activeTab === 'complaints' && (
              <ComplaintSystem 
                complaints={user.complaints}
                onSubmitComplaint={addComplaint}
              />
            )}

            {activeTab === 'payments' && (
              <PaymentSystem 
                user={user}
                onPayment={addPayment}
                payments={user.payments}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
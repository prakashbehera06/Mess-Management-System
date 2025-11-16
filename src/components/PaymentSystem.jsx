import React, { useState } from 'react';
import { DollarSign, CheckCircle, CreditCard } from 'lucide-react';

export default function PaymentSystem({ user, onPayment, payments }) {
  const [paymentAmount, setPaymentAmount] = useState(500);
  const [paymentMethod, setPaymentMethod] = useState('upi');

  const paymentOptions = [
    { amount: 500, tokens: 50, bonus: 0 },
    { amount: 1000, tokens: 110, bonus: 10 },
    { amount: 2000, tokens: 240, bonus: 40 },
    { amount: 5000, tokens: 650, bonus: 150 },
  ];

  const handlePayment = () => {
    const selectedOption = paymentOptions.find(opt => opt.amount === paymentAmount);
    if (!selectedOption) return;

    if (window.confirm(`Confirm payment of ₹${paymentAmount} for ${selectedOption.tokens} tokens?`)) {
      onPayment({
        amount: paymentAmount,
        tokens: selectedOption.tokens,
        method: paymentMethod,
        description: `Purchase of ${selectedOption.tokens} tokens`
      });
      
      alert(`Payment successful! ${selectedOption.tokens} tokens added to your account.`);
      setPaymentAmount(500);
    }
  };

  const customAmount = !paymentOptions.find(opt => opt.amount === paymentAmount);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Purchase Tokens</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {paymentOptions.map((option) => (
            <div
              key={option.amount}
              onClick={() => setPaymentAmount(option.amount)}
              className={`border-2 rounded-lg p-4 text-center cursor-pointer transition-all ${
                paymentAmount === option.amount 
                  ? 'border-indigo-500 bg-indigo-50' 
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
            >
              <p className="text-lg font-bold text-gray-800">₹{option.amount}</p>
              <p className="text-green-600 font-semibold">{option.tokens} Tokens</p>
              {option.bonus > 0 && (
                <p className="text-sm text-orange-600">+{option.bonus} Bonus</p>
              )}
            </div>
          ))}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Custom Amount</label>
          <input
            type="number"
            value={customAmount ? paymentAmount : ''}
            onChange={(e) => setPaymentAmount(Number(e.target.value))}
            placeholder="Enter custom amount"
            className="w-full px-4 py-2 border border-gray-300 rounded"
            min="100"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded"
          >
            <option value="upi">UPI</option>
            <option value="card">Credit/Debit Card</option>
            <option value="netbanking">Net Banking</option>
            <option value="wallet">Wallet</option>
          </select>
        </div>

        {paymentAmount >= 100 && (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
            <p className="text-green-800 font-semibold">
              You will receive {Math.floor(paymentAmount / 10)} tokens
              {paymentAmount >= 1000 && ` + ${Math.floor(paymentAmount / 50)} bonus tokens`}
            </p>
            <p className="text-green-600">
              Total: {Math.floor(paymentAmount / 10) + (paymentAmount >= 1000 ? Math.floor(paymentAmount / 50) : 0)} tokens
            </p>
          </div>
        )}

        <button
          onClick={handlePayment}
          disabled={paymentAmount < 100}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded flex items-center justify-center gap-2"
        >
          <CreditCard size={20} />
          Pay ₹{paymentAmount}
        </button>
      </div>

      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Payment History</h2>
        {payments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No payments made yet.</p>
        ) : (
          <div className="space-y-3">
            {payments.map((payment) => (
              <div key={payment.id} className="border border-gray-200 rounded p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{payment.description}</p>
                    <p className="text-sm text-gray-600">
                      {payment.method.toUpperCase()} • {new Date(payment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">₹{payment.amount}</p>
                    <p className="text-sm text-gray-600">+{payment.tokens} tokens</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2 text-green-600">
                  <CheckCircle size={16} />
                  <span className="text-sm">Completed</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
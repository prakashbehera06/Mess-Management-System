import React from 'react';
import { Utensils, CheckCircle } from 'lucide-react';

export default function MealBooking({ user, mealRates, onMealUpdate, calculateDailyFee, mealLocked }) {
  const dailyFee = calculateDailyFee(user.breakfast, user.lunch, user.dinner);
  const monthlyFee = dailyFee * 30;

  const mealPlans = [
    {
      type: 'breakfast',
      name: 'Breakfast',
      rate: mealRates.breakfast,
      description: '7:00 AM - 9:30 AM',
      enabled: user.breakfast
    },
    {
      type: 'lunch',
      name: 'Lunch',
      rate: mealRates.lunch,
      description: '12:00 PM - 2:30 PM',
      enabled: user.lunch
    },
    {
      type: 'dinner',
      name: 'Dinner',
      rate: mealRates.dinner,
      description: '7:00 PM - 9:30 PM',
      enabled: user.dinner
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Utensils size={24} />
          Meal Subscription Plans
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {mealPlans.map((meal) => (
            <div
              key={meal.type}
              className={`border-2 rounded-lg p-4 transition-all ${
                meal.enabled 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg text-gray-800">{meal.name}</h3>
                {meal.enabled && <CheckCircle size={20} className="text-green-600" />}
              </div>
              
              <p className="text-2xl font-bold text-indigo-600 mb-2">₹{meal.rate}<span className="text-sm font-normal text-gray-600">/day</span></p>
              <p className="text-sm text-gray-600 mb-4">{meal.description}</p>
              
              <button
                onClick={() => onMealUpdate(meal.type, !meal.enabled)}
                disabled={mealLocked}
                className={`w-full py-2 px-4 rounded font-semibold ${
                  mealLocked
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : meal.enabled
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {mealLocked ? 'Locked' : meal.enabled ? 'Cancel Subscription' : 'Subscribe'}
              </button>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h3 className="font-bold text-gray-800 mb-2">Current Subscription Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Daily Rate</p>
              <p className="text-xl font-bold text-blue-600">₹{dailyFee}</p>
            </div>
            <div>
              <p className="text-gray-600">Monthly Estimate</p>
              <p className="text-xl font-bold text-blue-600">₹{monthlyFee}</p>
            </div>
            <div>
              <p className="text-gray-600">Active Plans</p>
              <p className="text-xl font-bold text-blue-600">
                {mealPlans.filter(meal => meal.enabled).length}/3
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
        <h3 className="text-lg font-bold text-gray-800 mb-3">Important Notes</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• Meal subscriptions can be modified anytime</li>
          <li>• Changes take effect from the next day</li>
          <li>• Monthly billing is based on 30 days</li>
          <li>• Tokens are deducted for each meal consumed</li>
          <li>• Ensure you have sufficient tokens for your subscribed meals</li>
        </ul>
      </div>

      <div className="bg-green-50 rounded-lg p-6 border-2 border-green-300">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Fee Calculation</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Breakfast ({user.breakfast ? 'Subscribed' : 'Not Subscribed'}):</span>
            <span>₹{user.breakfast ? mealRates.breakfast : 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Lunch ({user.lunch ? 'Subscribed' : 'Not Subscribed'}):</span>
            <span>₹{user.lunch ? mealRates.lunch : 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Dinner ({user.dinner ? 'Subscribed' : 'Not Subscribed'}):</span>
            <span>₹{user.dinner ? mealRates.dinner : 0}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-bold text-lg">
            <span>Total Daily Fee:</span>
            <span className="text-green-600">₹{dailyFee}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Monthly (30 days):</span>
            <span>₹{monthlyFee}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
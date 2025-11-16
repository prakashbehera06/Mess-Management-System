import React, { useState } from 'react';
import { LogOut, UserPlus, Trash2, QrCode, Lock, Unlock, MessageSquare, CheckCircle, X, Printer, Calendar } from 'lucide-react';
import QRScanner from './QRScanner';

export default function AdminDashboard({ onLogout, students, addStudent, deleteStudent, updateStudent, mealLocked, setMealLocked, transactions, addTransaction, updateComplaint }) {
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [scanType, setScanType] = useState('');
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentPassword, setNewStudentPassword] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [editingRoom, setEditingRoom] = useState(null);
  const [newRoom, setNewRoom] = useState('');

  const mealRates = {
    breakfast: 30,
    lunch: 60,
    dinner: 40
  };

  const totalStudents = students.length;
  const totalRevenue = students.reduce((sum, s) => sum + s.totalSpent, 0);
  const activeSubscriptions = students.filter(s => s.breakfast || s.lunch || s.dinner).length;
  
  // Meal statistics
  const breakfastCount = students.filter(s => s.breakfast).length;
  const lunchCount = students.filter(s => s.lunch).length;
  const dinnerCount = students.filter(s => s.dinner).length;
  
  // Filter transactions by selected date - handle both date formats
  const dailyTransactions = transactions.filter(t => {
    const transactionDate = t.date || (t.timestamp ? new Date(t.timestamp).toISOString().split('T')[0] : null);
    return transactionDate === selectedDate;
  }).sort((a, b) => {
    // Sort by timestamp descending (newest first)
    const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
    const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
    return timeB - timeA;
  });

  const handlePrintTransactions = () => {
    const printWindow = window.open('', '_blank');
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Daily Transactions - ${selectedDate}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #4f46e5; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #4f46e5; color: white; }
            tr:nth-child(even) { background-color: #f2f2f2; }
            .summary { margin-top: 20px; padding: 10px; background-color: #f9fafb; }
          </style>
        </head>
        <body>
          <h1>Daily Transactions Report</h1>
          <p><strong>Date:</strong> ${new Date(selectedDate).toLocaleDateString()}</p>
          <p><strong>Total Transactions:</strong> ${dailyTransactions.length}</p>
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Meal Type</th>
                <th>Tokens Used</th>
                <th>Remaining Tokens</th>
              </tr>
            </thead>
            <tbody>
              ${dailyTransactions.map(t => `
                <tr>
                  <td>${t.timestamp ? new Date(t.timestamp).toLocaleTimeString() : 'N/A'}</td>
                  <td>${t.studentId || 'N/A'}</td>
                  <td>${t.studentName || 'N/A'}</td>
                  <td>${(t.mealType || '').charAt(0).toUpperCase() + (t.mealType || '').slice(1)}</td>
                  <td>${t.tokensUsed || 1}</td>
                  <td>${t.remainingTokens || 'N/A'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="summary">
            <p><strong>Printed on:</strong> ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `;
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  const calculateDailyFee = (breakfast, lunch, dinner) => {
    let total = 0;
    if (breakfast) total += mealRates.breakfast;
    if (lunch) total += mealRates.lunch;
    if (dinner) total += mealRates.dinner;
    return total;
  };

  const handleAddStudent = () => {
    if (newStudentName && newStudentEmail && newStudentPassword) {
      const newId = `STU${String(students.length + 1).padStart(3, '0')}`;
      
      // Generate room number (A/B/C block, floor 1-3, room 01-20)
      const blocks = ['A', 'B', 'C'];
      const block = blocks[Math.floor(Math.random() * blocks.length)];
      const floor = Math.floor(Math.random() * 3) + 1;
      const roomNum = String(Math.floor(Math.random() * 20) + 1).padStart(2, '0');
      const room = `${block}-${floor}${roomNum}`;
      
      const newStudent = {
        id: newId,
        name: newStudentName,
        password: newStudentPassword,
        email: newStudentEmail,
        room: room,
        breakfast: false,
        lunch: false,
        dinner: false,
        tokens: 0,
        totalSpent: 0,
        complaints: [],
        payments: []
      };
      addStudent(newStudent);
      alert(`Student added with ID: ${newId}\nRoom Allocated: ${room}`);
      setNewStudentName('');
      setNewStudentEmail('');
      setNewStudentPassword('');
    } else {
      alert('Please fill all fields');
    }
  };

  const handleRoomChange = (studentId) => {
    if (!newRoom.trim()) {
      alert('Please enter a room number');
      return;
    }
    updateStudent(studentId, { room: newRoom.trim() });
    setEditingRoom(null);
    setNewRoom('');
    alert('Room updated successfully!');
  };

  const handleTokenUpdate = (studentId, tokenChange) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      const newTokens = Math.max(0, student.tokens + tokenChange);
      updateStudent(studentId, { tokens: newTokens });
    }
  };

  const handleReplyToComplaint = (studentId, complaintId) => {
    if (!replyText.trim()) {
      alert('Please enter a reply');
      return;
    }
    updateComplaint(studentId, complaintId, {
      adminReply: replyText,
      status: 'in-progress',
      repliedAt: new Date().toISOString()
    });
    setReplyingTo(null);
    setReplyText('');
    alert('Reply sent successfully!');
  };

  const handleCloseComplaint = (studentId, complaintId) => {
    updateComplaint(studentId, complaintId, {
      status: 'resolved',
      resolvedAt: new Date().toISOString()
    });
    alert('Complaint marked as resolved!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {showQRScanner && (
        <QRScanner 
          onClose={() => setShowQRScanner(false)} 
          mealType={scanType}
          students={students}
          updateStudent={updateStudent}
          addTransaction={addTransaction}
        />
      )}
      
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Admin Panel</h1>
              <p className="text-indigo-100 flex items-center gap-2 mt-1">
                <Calendar size={16} />
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
            {['overview', 'students', 'complaints', 'transactions', 'scanner'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-semibold rounded whitespace-nowrap ${
                  activeTab === tab ? 'bg-white text-indigo-600' : 'text-gray-600'
                }`}
              >
                {tab === 'overview' && 'Overview'}
                {tab === 'students' && 'Students'}
                {tab === 'complaints' && 'Complaints'}
                {tab === 'transactions' && 'Transactions'}
                {tab === 'scanner' && 'QR Scanner'}
              </button>
            ))}
          </div>

          <div className="p-6 space-y-6">
            {activeTab === 'overview' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-300">
                    <p className="text-gray-600 text-sm">Total Students</p>
                    <p className="text-4xl font-bold text-blue-600">{totalStudents}</p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-6 border-2 border-green-300">
                    <p className="text-gray-600 text-sm">Total Revenue</p>
                    <p className="text-4xl font-bold text-green-600">₹{totalRevenue}</p>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-6 border-2 border-purple-300">
                    <p className="text-gray-600 text-sm">Active Subscriptions</p>
                    <p className="text-4xl font-bold text-purple-600">{activeSubscriptions}</p>
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-300">
                  <h3 className="font-bold text-gray-800 mb-2">Meal Rates:</h3>
                  <div className="flex gap-8">
                    <div><p>Breakfast: ₹{mealRates.breakfast}</p></div>
                    <div><p>Lunch: ₹{mealRates.lunch}</p></div>
                    <div><p>Dinner: ₹{mealRates.dinner}</p></div>
                  </div>
                </div>

                <div className="bg-indigo-50 rounded-lg p-6 border-2 border-indigo-300">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Meal Subscription Statistics</h3>
                    <div className="flex items-center gap-2">
                      {mealLocked ? (
                        <span className="flex items-center gap-2 bg-red-100 text-red-800 px-3 py-1 rounded text-sm font-semibold">
                          <Lock size={16} /> Locked
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded text-sm font-semibold">
                          <Unlock size={16} /> Unlocked
                        </span>
                      )}
                      <button
                        onClick={() => setMealLocked(!mealLocked)}
                        className={`flex items-center gap-2 px-4 py-2 rounded font-semibold ${
                          mealLocked 
                            ? 'bg-green-600 hover:bg-green-700 text-white' 
                            : 'bg-red-600 hover:bg-red-700 text-white'
                        }`}
                      >
                        {mealLocked ? <><Unlock size={16} /> Unlock Meals</> : <><Lock size={16} /> Lock Meals</>}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                      <p className="text-gray-600 text-sm">Breakfast Subscriptions</p>
                      <p className="text-3xl font-bold text-orange-600">{breakfastCount}</p>
                      <p className="text-xs text-gray-500 mt-1">out of {totalStudents} students</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <p className="text-gray-600 text-sm">Lunch Subscriptions</p>
                      <p className="text-3xl font-bold text-green-600">{lunchCount}</p>
                      <p className="text-xs text-gray-500 mt-1">out of {totalStudents} students</p>
                    </div>
                    <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                      <p className="text-gray-600 text-sm">Dinner Subscriptions</p>
                      <p className="text-3xl font-bold text-indigo-600">{dinnerCount}</p>
                      <p className="text-xs text-gray-500 mt-1">out of {totalStudents} students</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'students' && (
              <>
                <div className="bg-green-50 rounded-lg p-6 border-2 border-green-300">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Student</h2>
              <div className="grid grid-cols-1 gap-3">
                <input
                  type="text"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="Student Name"
                  className="px-4 py-2 border border-gray-300 rounded"
                />
                <input
                  type="email"
                  value={newStudentEmail}
                  onChange={(e) => setNewStudentEmail(e.target.value)}
                  placeholder="Email"
                  className="px-4 py-2 border border-gray-300 rounded"
                />
                <input
                  type="password"
                  value={newStudentPassword}
                  onChange={(e) => setNewStudentPassword(e.target.value)}
                  placeholder="Password"
                  className="px-4 py-2 border border-gray-300 rounded"
                />
                <button
                  onClick={handleAddStudent}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
                >
                  Add Student
                </button>
              </div>
            </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Students Database</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-indigo-600 text-white">
                      <th className="border px-4 py-2 text-left">ID</th>
                      <th className="border px-4 py-2 text-left">Name</th>
                      <th className="border px-4 py-2 text-left">Email</th>
                      <th className="border px-4 py-2 text-left">Room</th>
                      <th className="border px-4 py-2">Tokens</th>
                      <th className="border px-4 py-2">B</th>
                      <th className="border px-4 py-2">L</th>
                      <th className="border px-4 py-2">D</th>
                      <th className="border px-4 py-2">Daily</th>
                      <th className="border px-4 py-2">Total</th>
                      <th className="border px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="border px-4 py-2">{student.id}</td>
                        <td className="border px-4 py-2">{student.name}</td>
                        <td className="border px-4 py-2 text-xs">{student.email}</td>
                        <td className="border px-4 py-2">
                          {editingRoom === student.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={newRoom}
                                onChange={(e) => setNewRoom(e.target.value)}
                                placeholder="Room (e.g., A-101)"
                                className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                                onKeyPress={(e) => e.key === 'Enter' && handleRoomChange(student.id)}
                              />
                              <button
                                onClick={() => handleRoomChange(student.id)}
                                className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
                              >
                                ✓
                              </button>
                              <button
                                onClick={() => {
                                  setEditingRoom(null);
                                  setNewRoom('');
                                }}
                                className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                              >
                                ✗
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{student.room || 'N/A'}</span>
                              <button
                                onClick={() => {
                                  setEditingRoom(student.id);
                                  setNewRoom(student.room || '');
                                }}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                                title="Change Room"
                              >
                                Edit
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => handleTokenUpdate(student.id, -1)}
                              className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                            >
                              -
                            </button>
                            <span className="font-bold">{student.tokens}</span>
                            <button 
                              onClick={() => handleTokenUpdate(student.id, 1)}
                              className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="border px-4 py-2 text-center">{student.breakfast ? '✓' : '✗'}</td>
                        <td className="border px-4 py-2 text-center">{student.lunch ? '✓' : '✗'}</td>
                        <td className="border px-4 py-2 text-center">{student.dinner ? '✓' : '✗'}</td>
                        <td className="border px-4 py-2 text-center">₹{calculateDailyFee(student.breakfast, student.lunch, student.dinner)}</td>
                        <td className="border px-4 py-2 text-center">₹{student.totalSpent}</td>
                        <td className="border px-4 py-2 text-center">
                          <button
                            onClick={() => deleteStudent(student.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  </table>
                </div>
              </div>
              </>
            )}

            {activeTab === 'complaints' && (
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4">All Complaints</h2>
                <div className="space-y-4">
                  {students.flatMap(student => 
                    student.complaints.map(complaint => (
                      <div key={complaint.id} className="border border-gray-200 rounded p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold text-lg">{complaint.subject}</span>
                              <span className={`px-2 py-1 rounded text-xs ${
                                complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                complaint.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {complaint.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{complaint.description}</p>
                            <p className="text-xs text-gray-500">
                              By: {student.name} ({student.id}) • Room: {student.room || 'N/A'} • Category: {complaint.category.replace('room-', '').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} • {new Date(complaint.createdAt).toLocaleDateString()}
                            </p>
                            {complaint.adminReply && (
                              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                                <p className="text-xs font-semibold text-blue-800 mb-1">Admin Reply:</p>
                                <p className="text-sm text-blue-900">{complaint.adminReply}</p>
                                {complaint.repliedAt && (
                                  <p className="text-xs text-blue-600 mt-1">
                                    Replied on: {new Date(complaint.repliedAt).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          {replyingTo?.complaintId === complaint.id ? (
                            <div className="flex-1 space-y-2">
                              <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Enter your reply..."
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                                rows="3"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleReplyToComplaint(student.id, complaint.id)}
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-semibold"
                                >
                                  Send Reply
                                </button>
                                <button
                                  onClick={() => {
                                    setReplyingTo(null);
                                    setReplyText('');
                                  }}
                                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded text-sm font-semibold"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              {complaint.status !== 'resolved' && (
                                <>
                                  <button
                                    onClick={() => setReplyingTo({ studentId: student.id, complaintId: complaint.id })}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-semibold"
                                  >
                                    <MessageSquare size={16} /> Reply
                                  </button>
                                  <button
                                    onClick={() => handleCloseComplaint(student.id, complaint.id)}
                                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-semibold"
                                  >
                                    <CheckCircle size={16} /> Close
                                  </button>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                  {students.flatMap(s => s.complaints).length === 0 && (
                    <p className="text-gray-500 text-center py-8">No complaints submitted yet.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'transactions' && (
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                  <h2 className="text-xl font-bold text-gray-800">Daily Transactions</h2>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded"
                    />
                    {dailyTransactions.length > 0 && (
                      <button
                        onClick={handlePrintTransactions}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded font-semibold"
                      >
                        <Printer size={18} /> Print
                      </button>
                    )}
                  </div>
                </div>
                {dailyTransactions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No transactions found for {new Date(selectedDate).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-400 mt-2">Total transactions in system: {transactions.length}</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm" id="transactions-table">
                      <thead>
                        <tr className="bg-indigo-600 text-white">
                          <th className="border px-4 py-2 text-left">Time</th>
                          <th className="border px-4 py-2 text-left">Student ID</th>
                          <th className="border px-4 py-2 text-left">Student Name</th>
                          <th className="border px-4 py-2">Meal Type</th>
                          <th className="border px-4 py-2">Tokens Used</th>
                          <th className="border px-4 py-2">Remaining Tokens</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dailyTransactions.map((transaction, idx) => (
                          <tr key={transaction.id || idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="border px-4 py-2">
                              {transaction.timestamp ? new Date(transaction.timestamp).toLocaleTimeString() : 'N/A'}
                            </td>
                            <td className="border px-4 py-2">{transaction.studentId || 'N/A'}</td>
                            <td className="border px-4 py-2">{transaction.studentName || 'N/A'}</td>
                            <td className="border px-4 py-2 text-center capitalize">{transaction.mealType || 'N/A'}</td>
                            <td className="border px-4 py-2 text-center">{transaction.tokensUsed || 1}</td>
                            <td className="border px-4 py-2 text-center">{transaction.remainingTokens !== undefined ? transaction.remainingTokens : 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="mt-4 p-3 bg-gray-50 rounded">
                      <p className="text-sm font-semibold text-gray-700">
                        Total Transactions: {dailyTransactions.length} | Date: {new Date(selectedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'scanner' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => {
                    setScanType('breakfast');
                    setShowQRScanner(true);
                  }}
                  className="bg-orange-400 hover:bg-orange-500 text-white p-6 rounded-lg font-semibold"
                >
                  Scan Breakfast
                </button>
                <button
                  onClick={() => {
                    setScanType('lunch');
                    setShowQRScanner(true);
                  }}
                  className="bg-green-400 hover:bg-green-500 text-white p-6 rounded-lg font-semibold"
                >
                  Scan Lunch
                </button>
                <button
                  onClick={() => {
                    setScanType('dinner');
                    setShowQRScanner(true);
                  }}
                  className="bg-indigo-400 hover:bg-indigo-500 text-white p-6 rounded-lg font-semibold"
                >
                  Scan Dinner
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
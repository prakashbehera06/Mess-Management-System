import React, { useState } from 'react';
import { UserPlus, LogOut } from 'lucide-react';

export default function Login({ onStudentLogin, onAdminLogin, students, addStudent }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const handleStudentLogin = () => {
    if (!loginId.trim() || !loginPassword.trim()) {
      alert('Please enter both Email and Password');
      return;
    }
    
    const user = students.find(s => s.email === loginId && s.password === loginPassword);
    if (user) {
      onStudentLogin(user);
      setLoginId('');
      setLoginPassword('');
    } else {
      alert('Invalid Email or Password');
    }
  };

  const handleRegister = () => {
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim() || !regConfirmPassword.trim()) {
      alert('Please fill all fields');
      return;
    }
    
    if (regPassword !== regConfirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (students.some(s => s.email === regEmail)) {
      alert('Email already registered');
      return;
    }

    const newId = `STU${String(students.length + 1).padStart(3, '0')}`;
    
    // Generate room number (A/B/C block, floor 1-3, room 01-20)
    const blocks = ['A', 'B', 'C'];
    const block = blocks[Math.floor(Math.random() * blocks.length)];
    const floor = Math.floor(Math.random() * 3) + 1;
    const roomNum = String(Math.floor(Math.random() * 20) + 1).padStart(2, '0');
    const room = `${block}-${floor}${roomNum}`;
    
    const newStudent = {
      id: newId,
      name: regName,
      password: regPassword,
      email: regEmail,
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
    alert(`Registration successful!\nYour Student ID: ${newId}\nYour Room: ${room}`);
    
    setRegName('');
    setRegEmail('');
    setRegPassword('');
    setRegConfirmPassword('');
    setIsLoginMode(true);
  };

  const handleAdminLogin = () => {
    if (adminPassword === 'admin123') {
      onAdminLogin(true);
      setAdminPassword('');
    } else {
      alert('Invalid admin password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center text-indigo-600 mb-2">Mess Management</h1>
          <p className="text-center text-gray-600 mb-8">System</p>
          
          <button
            onClick={() => setShowAdminPanel(!showAdminPanel)}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded mb-6"
          >
            {showAdminPanel ? 'Student Mode' : 'Admin Mode'}
          </button>

          {!showAdminPanel ? (
            <>
              {isLoginMode ? (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Student Login</h2>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">Email</label>
                    <input
                      type="email"
                      value={loginId}
                      onChange={(e) => setLoginId(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-4 py-2 border border-gray-300 rounded"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">Password</label>
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full px-4 py-2 border border-gray-300 rounded"
                    />
                  </div>

                  <button
                    onClick={handleStudentLogin}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded mb-4"
                  >
                    Login
                  </button>

                  <button
                    onClick={() => setIsLoginMode(false)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
                  >
                    Register New Account
                  </button>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Register</h2>
                  
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
                  />

                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
                  />

                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
                  />

                  <input
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    className="w-full px-4 py-2 border border-gray-300 rounded mb-6"
                  />

                  <button
                    onClick={handleRegister}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded mb-4"
                  >
                    Register
                  </button>

                  <button
                    onClick={() => setIsLoginMode(true)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded"
                  >
                    Back to Login
                  </button>
                </div>
              )}
            </>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Login</h2>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Admin Password"
                className="w-full px-4 py-2 border border-gray-300 rounded mb-6"
              />
              <button
                onClick={handleAdminLogin}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded"
              >
                Login
              </button>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded border border-blue-200">
            <p className="text-sm font-semibold text-gray-700">Demo:</p>
            <p className="text-sm text-gray-600">Email: rajesh@college.com | Pass: 1234</p>
            <p className="text-sm text-gray-600">Admin: admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
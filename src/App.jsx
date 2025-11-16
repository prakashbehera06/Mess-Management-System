import React, { useState } from 'react';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [mealLocked, setMealLocked] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [students, setStudents] = useState([
    { 
      id: 'STU001', 
      name: 'Rajesh Kumar', 
      password: '1234', 
      email: 'rajesh@college.com', 
      room: 'A-101',
      breakfast: true, 
      lunch: true, 
      dinner: false,
      tokens: 45,
      totalSpent: 5400,
      complaints: [],
      payments: []
    },
    { 
      id: 'STU002', 
      name: 'Priya Singh', 
      password: '1234', 
      email: 'priya@college.com', 
      room: 'B-205',
      breakfast: true, 
      lunch: true, 
      dinner: true,
      tokens: 72,
      totalSpent: 8640,
      complaints: [],
      payments: []
    }
  ]);

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdminLoggedIn(false);
  };

  const updateStudent = (studentId, updates) => {
    setStudents(prev => prev.map(s => 
      s.id === studentId ? { ...s, ...updates } : s
    ));
    
    if (currentUser && currentUser.id === studentId) {
      setCurrentUser(prev => ({ ...prev, ...updates }));
    }
  };

  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now() + Math.random(), // Ensure unique ID
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString()
    };
    setTransactions(prev => {
      const updated = [...prev, newTransaction];
      console.log('Transaction added:', newTransaction);
      console.log('Total transactions:', updated.length);
      return updated;
    });
  };

  const updateComplaint = (studentId, complaintId, updates) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const updatedComplaints = s.complaints.map(c => 
          c.id === complaintId ? { ...c, ...updates } : c
        );
        return { ...s, complaints: updatedComplaints };
      }
      return s;
    }));
  };

  const addStudent = (newStudent) => {
    setStudents(prev => [...prev, newStudent]);
  };

  const deleteStudent = (studentId) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
  };

  if (!currentUser && !isAdminLoggedIn) {
    return (
      <Login 
        onStudentLogin={setCurrentUser}
        onAdminLogin={setIsAdminLoggedIn}
        students={students}
        addStudent={addStudent}
      />
    );
  }

  if (currentUser) {
    return (
      <StudentDashboard 
        user={currentUser}
        onLogout={handleLogout}
        updateStudent={updateStudent}
        students={students}
        mealLocked={mealLocked}
      />
    );
  }

  if (isAdminLoggedIn) {
    return (
      <AdminDashboard 
        onLogout={handleLogout}
        students={students}
        addStudent={addStudent}
        deleteStudent={deleteStudent}
        updateStudent={updateStudent}
        mealLocked={mealLocked}
        setMealLocked={setMealLocked}
        transactions={transactions}
        addTransaction={addTransaction}
        updateComplaint={updateComplaint}
      />
    );
  }
}
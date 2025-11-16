import React, { useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { QrCode } from 'lucide-react';

export default function QRScanner({ onClose, mealType, students, updateStudent, addTransaction }) {
  const [scannedCode, setScannedCode] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const verifyAndRedeem = React.useCallback((studentId) => {
    if (!studentId.trim()) {
      alert('Please enter a student ID');
      return;
    }

    const student = students.find(s => s.id === studentId.toUpperCase());
    if (!student) {
      setScanResult({ success: false, message: 'Student not found' });
      return;
    }

    if (student.tokens <= 0) {
      setScanResult({ success: false, message: 'Insufficient tokens! Please recharge.' });
      return;
    }

    if (!student[mealType]) {
      setScanResult({ success: false, message: `Student has not subscribed to ${mealType}` });
      return;
    }

    const updatedStudent = { ...student, tokens: student.tokens - 1 };
    updateStudent(student.id, { tokens: updatedStudent.tokens });
    
    // Record transaction
    if (addTransaction) {
      const transactionData = {
        studentId: student.id,
        studentName: student.name,
        mealType: mealType,
        tokensUsed: 1,
        remainingTokens: updatedStudent.tokens
      };
      addTransaction(transactionData);
    }
    
    setScanResult({ 
      success: true, 
      message: `Token redeemed successfully!\nStudent: ${student.name}\nMeal: ${mealType}\nRemaining tokens: ${updatedStudent.tokens}` 
    });

    setTimeout(() => {
      setScannedCode('');
      setScanResult(null);
    }, 3000);
  }, [students, mealType, updateStudent, addTransaction]);

  const handleScannedCode = React.useCallback((code) => {
    try {
      const parsedData = JSON.parse(code);
      const studentId = parsedData.studentId;
      setScannedCode(studentId);
      verifyAndRedeem(studentId);
    } catch (error) {
      // If not JSON, treat as plain student ID
      setScannedCode(code);
      verifyAndRedeem(code);
    }
  }, [verifyAndRedeem]);

  React.useEffect(() => {
    let scanner;
    
    if (isCameraActive) {
      scanner = new Html5QrcodeScanner('qr-reader', {
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 5,
      });

      scanner.render(handleScannedCode, () => {
        // QR scan error - ignore
      });
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(error => {
          console.error('Failed to clear html5QrcodeScanner.', error);
        });
      }
    };
  }, [isCameraActive, handleScannedCode]);

  const handleManualScan = () => {
    verifyAndRedeem(scannedCode);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Scan QR Code - {mealType}</h3>
          <button onClick={onClose} className="text-gray-500 text-2xl">×</button>
        </div>
        
        {!isCameraActive ? (
          <div className="bg-gray-100 p-8 rounded-lg text-center mb-4">
            <QrCode size={100} className="text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-600">Click below to activate camera</p>
            <button
              onClick={() => setIsCameraActive(true)}
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded"
            >
              Activate Camera
            </button>
          </div>
        ) : (
          <div id="qr-reader" className="mb-4"></div>
        )}
        
        <div className="text-center mb-4">
          <p className="text-gray-600 mb-2">Or enter Student ID manually:</p>
          <input
            type="text"
            value={scannedCode}
            onChange={(e) => setScannedCode(e.target.value)}
            placeholder="Enter Student ID (e.g., STU001)"
            className="w-full px-4 py-2 border border-gray-300 rounded mb-2"
          />
          <button
            onClick={handleManualScan}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded"
          >
            Verify & Redeem Token
          </button>
        </div>

        {scanResult && (
          <div className={`mt-4 p-4 rounded ${scanResult.success ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'}`}>
            <p className={`font-semibold ${scanResult.success ? 'text-green-800' : 'text-red-800'}`}>
              {scanResult.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
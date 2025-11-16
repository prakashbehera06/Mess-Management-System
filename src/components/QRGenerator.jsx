import React from 'react';
import QRCode from 'qrcode.react';

export default function QRGenerator({ student, onClose, showOnly = false }) {
  const qrData = JSON.stringify({
    studentId: student.id,
    name: student.name,
    tokens: student.tokens
  });

  return (
    <div className={`${showOnly ? '' : 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'}`}>
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        {!showOnly && (
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Your QR Code</h3>
            <button onClick={onClose} className="text-gray-500 text-2xl">×</button>
          </div>
        )}
        
        <div className="text-center">
          <div className="mx-auto mb-4 flex justify-center">
            <QRCode 
              value={qrData} 
              size={200}
              level="H"
              includeMargin={true}
            />
          </div>
          <p className="text-sm text-gray-600 mb-2">Student ID: {student.id}</p>
          <p className="text-sm text-gray-600">Tokens: {student.tokens}</p>
          <p className="text-xs text-gray-500 mt-4">
            Show this QR code at the mess counter to redeem tokens
          </p>
        </div>
        
        {!showOnly && (
          <button
            onClick={onClose}
            className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
}
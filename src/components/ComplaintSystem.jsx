import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

export default function ComplaintSystem({ complaints, onSubmitComplaint }) {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('food-quality');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      alert('Please fill all fields');
      return;
    }

    onSubmitComplaint({
      subject,
      description,
      category,
      type: 'complaint'
    });

    setSubject('');
    setDescription('');
    setCategory('food-quality');
    alert('Complaint submitted successfully!');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'in-progress':
        return <Clock size={16} className="text-yellow-600" />;
      default:
        return <AlertCircle size={16} className="text-red-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Submit Complaint/Suggestion</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded"
            >
              <optgroup label="Mess Related">
                <option value="food-quality">Food Quality</option>
                <option value="hygiene">Hygiene & Cleanliness</option>
                <option value="service">Service Issues</option>
                <option value="billing">Billing & Payments</option>
              </optgroup>
              <optgroup label="Room Related">
                <option value="room-light">Room Light Issue</option>
                <option value="room-water">Water Supply Issue</option>
                <option value="room-fan">Fan/AC Issue</option>
                <option value="room-cleaning">Room Cleaning</option>
                <option value="room-furniture">Furniture Issue</option>
                <option value="room-bathroom">Bathroom Issue</option>
                <option value="room-other">Other Room Issue</option>
              </optgroup>
              <optgroup label="General">
                <option value="suggestion">Suggestion</option>
                <option value="other">Other</option>
              </optgroup>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief subject of your complaint"
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of your complaint or suggestion..."
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
          </div>

          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded"
          >
            Submit Complaint
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">My Complaints</h2>
        {complaints.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No complaints submitted yet.</p>
        ) : (
          <div className="space-y-4">
            {complaints.map((complaint) => (
              <div key={complaint.id} className="border border-gray-200 rounded p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(complaint.status)}
                    <span className="font-semibold">{complaint.subject}</span>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                    complaint.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {complaint.status}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">{complaint.description}</p>
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
                <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                  <span>Category: {complaint.category}</span>
                  <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import React from 'react';

const AdminCredentialsInfo = () => {
  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <h3 className="font-semibold mb-2">Admin Access:</h3>
      <p className="text-sm text-gray-600">Use your admin email and password to access the system.</p>
      <p className="text-sm text-gray-600 mt-1">Make sure your profile has admin role in the database.</p>
    </div>
  );
};

export default AdminCredentialsInfo;

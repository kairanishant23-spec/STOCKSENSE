import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Key } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const ProfilePage: React.FC = () => {
  const auth = useAuth();
  // Safe fallback if auth context is not yet fully defined or user is missing
  const user = auth?.user || {
    id: 'USR-001',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    role: 'Admin'
  };

  const handleEditProfile = () => {
    alert('Edit profile functionality coming soon!');
  };

  const handleChangePassword = () => {
    alert('Password change dialog coming soon!');
  };

  const initials = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
          
          <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-16 mb-8">
              <div className="w-32 h-32 bg-white rounded-full p-2 shadow-md">
                <div className="w-full h-full bg-indigo-100 rounded-full flex items-center justify-center text-4xl font-bold text-indigo-700">
                  {initials}
                </div>
              </div>
              
              <button 
                onClick={handleEditProfile}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors"
              >
                Edit Profile
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal Information</h3>
                
                <div className="flex items-start space-x-4">
                  <User className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium text-gray-900">{user.name}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Mail className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-medium text-gray-900">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Shield className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="font-medium text-gray-900">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {user.role}
                      </span>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-5 h-5 flex items-center justify-center mt-1 text-gray-400 font-bold text-xs bg-gray-100 rounded-full">ID</div>
                  <div>
                    <p className="text-sm text-gray-500">Login ID</p>
                    <p className="font-medium text-gray-900">{user.id}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Security</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="flex items-center space-x-3 mb-4">
                    <Key className="w-5 h-5 text-gray-600" />
                    <h4 className="font-medium text-gray-900">Password</h4>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    Update your password to keep your account secure.
                  </p>
                  <button 
                    onClick={handleChangePassword}
                    className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium rounded-lg transition-colors text-sm"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;

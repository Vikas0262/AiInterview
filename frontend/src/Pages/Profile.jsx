import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaChartLine, FaHistory, FaCog, FaSignOutAlt } from 'react-icons/fa';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate fetching user data
    const fetchUserData = () => {
      // In a real app, you would fetch this from your auth context or API
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData) {
        navigate('/');
        return;
      }
      setUser(userData);
      setLoading(false);
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
            <div className="flex items-center">
              <div className="bg-white/20 p-3 rounded-full">
                <FaUser className="w-8 h-8" />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold">{user?.name || 'User'}</h1>
                <p className="text-blue-100">{user?.email || 'user@example.com'}</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            <div className="p-6 text-center">
              <p className="text-3xl font-bold text-gray-900">12</p>
              <p className="text-gray-500">Interviews</p>
            </div>
            <div className="p-6 text-center">
              <p className="text-3xl font-bold text-gray-900">8.5</p>
              <p className="text-gray-500">Avg. Score</p>
            </div>
            <div className="p-6 text-center">
              <p className="text-3xl font-bold text-gray-900">3</p>
              <p className="text-gray-500">Skills</p>
            </div>
          </div>

          {/* Progress */}
          <div className="p-6 border-t border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Your Progress</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Data Structures</span>
                  <span>65%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Algorithms</span>
                  <span>45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>System Design</span>
                  <span>30%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="p-6 border-t border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <FaHistory className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Completed mock interview #{item}</p>
                    <p className="text-xs text-gray-500">2 days ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-200">
            <button className="flex items-center text-gray-600 hover:text-gray-900">
              <FaCog className="mr-2" />
              Settings
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center text-red-600 hover:text-red-800"
            >
              <FaSignOutAlt className="mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

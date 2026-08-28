import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading dashboard...</div>;
  }

  return (
    <div className="p-8 bg-gray-50 dark:bg-slate-900 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600">{stats?.totalUsers || 0}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-2">Total Lawyers</h3>
          <p className="text-3xl font-bold text-green-600">{stats?.totalLawyers || 0}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-2">Total Consultations</h3>
          <p className="text-3xl font-bold text-purple-600">{stats?.totalConsultations || 0}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-orange-600">₹{stats?.totalRevenue || 0}</p>
        </div>
      </div>

      {/* Tabs for management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Users</h2>
          <div className="space-y-2">
            <p className="text-gray-600 dark:text-gray-400">Manage platform users and permissions</p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">View All Users</button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Lawyers</h2>
          <div className="space-y-2">
            <p className="text-gray-600 dark:text-gray-400">Verify and manage lawyer profiles</p>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Verify Lawyers</button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Content</h2>
          <div className="space-y-2">
            <p className="text-gray-600 dark:text-gray-400">Manage blog, FAQs, and testimonials</p>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Manage Content</button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Payments</h2>
          <div className="space-y-2">
            <p className="text-gray-600 dark:text-gray-400">View and manage payment transactions</p>
            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">View Payments</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

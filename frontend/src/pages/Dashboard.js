import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#3B82F6', '#F59E0B', '#10B981', '#EF4444'];

const Dashboard = () => {
  const { token, user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('https://placement-tracker-backend-76cz.onrender.com/api/applications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setApplications(res.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // Analytics calculations
  const total = applications.length;
  const selected = applications.filter(a => a.status === 'Selected').length;
  const rejected = applications.filter(a => a.status === 'Rejected').length;
  const pending = applications.filter(a => a.status === 'Pending').length;
  const applied = applications.filter(a => a.status === 'Applied').length;
  const successRate = total > 0 ? ((selected / total) * 100).toFixed(1) : 0;

  const statusData = [
    { name: 'Applied', value: applied },
    { name: 'Pending', value: pending },
    { name: 'Selected', value: selected },
    { name: 'Rejected', value: rejected },
  ].filter(d => d.value > 0);

  // Company wise data for bar chart
  const companyData = applications.reduce((acc, app) => {
    const existing = acc.find(a => a.company === app.company);
    if (existing) {
      existing.applications += 1;
    } else {
      acc.push({ company: app.company, applications: 1 });
    }
    return acc;
  }, []);

  // Round wise failure analysis
  const roundFailures = {};
  applications.forEach(app => {
    app.rounds?.forEach(round => {
      if (round.result === 'Fail' && round.roundName) {
        roundFailures[round.roundName] = (roundFailures[round.roundName] || 0) + 1;
      }
    });
  });
  const roundData = Object.entries(roundFailures).map(([name, failures]) => ({
    name, failures
  }));

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <p className="text-gray-500 text-lg">Loading dashboard...</p>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-500 mt-1">Here's your placement journey at a glance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <p className="text-sm text-gray-500">Total Applications</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <p className="text-sm text-gray-500">Selected</p>
          <p className="text-3xl font-bold text-green-500 mt-1">{selected}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <p className="text-sm text-gray-500">Rejected</p>
          <p className="text-3xl font-bold text-red-500 mt-1">{rejected}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <p className="text-sm text-gray-500">Success Rate</p>
          <p className="text-3xl font-bold text-purple-500 mt-1">{successRate}%</p>
        </div>
      </div>

      {total === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-4">📊</p>
          <p className="text-lg">No data yet. Add applications to see analytics!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Pie Chart - Status Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-700 mb-4">Application Status</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart - Applications per Company */}
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-700 mb-4">Applications by Company</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={companyData}>
                <XAxis dataKey="company" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="applications" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Round Wise Failure */}
          {roundData.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <h2 className="text-lg font-bold text-gray-700 mb-4">
                ⚠️ Round-wise Failures
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={roundData}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="failures" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Smart Insights */}
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-700 mb-4">💡 Smart Insights</h2>
            <div className="space-y-3">
              {selected > 0 && (
                <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm">
                  🎉 You've been selected in {selected} company{selected > 1 ? 's' : ''}! Keep going!
                </div>
              )}
              {rejected > 2 && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                  📚 High rejections detected. Focus on interview preparation!
                </div>
              )}
              {roundData.length > 0 && (
                <div className="bg-yellow-50 text-yellow-700 p-3 rounded-lg text-sm">
                  ⚠️ You're failing most at: <strong>{roundData.sort((a,b) => b.failures - a.failures)[0].name}</strong> round. Practice more!
                </div>
              )}
              {pending > 0 && (
                <div className="bg-blue-50 text-blue-700 p-3 rounded-lg text-sm">
                  ⏳ {pending} application{pending > 1 ? 's are' : ' is'} still pending. Follow up!
                </div>
              )}
              {total < 5 && (
                <div className="bg-purple-50 text-purple-700 p-3 rounded-lg text-sm">
                  🚀 Apply to more companies to increase your chances!
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default Dashboard;
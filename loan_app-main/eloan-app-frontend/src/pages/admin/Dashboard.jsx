// src/pages/admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const StatCard = ({ title, value, colorClass }) => (
  <div className={`p-6 rounded-lg shadow-md ${colorClass}`}>
    <h3 className="text-lg font-semibold text-white">{title}</h3>
    <p className="text-4xl font-bold text-white mt-2">{value}</p>
  </div>
);

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !stats) return <p>Loading dashboard...</p>;

  const pieChartData = {
    labels: ['Pending', 'Processing', 'Accepted', 'Disbursed', 'Rejected'],
    datasets: [
      {
        label: '# of Applications',
        data: [
          stats.pending,
          stats.processing,
          stats.accepted,
          stats.disbursed,
          stats.rejected,
        ],
        backgroundColor: [
          'rgba(255, 206, 86, 0.7)', // Yellow
          'rgba(54, 162, 235, 0.7)', // Blue
          'rgba(153, 102, 255, 0.7)', // Purple
          'rgba(75, 192, 192, 0.7)', // Green
          'rgba(255, 99, 132, 0.7)', // Red
        ],
        borderColor: [
          'rgba(255, 206, 86, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-dark-slate mb-6">Admin Dashboard</h2>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Users" value={stats.totalUsers} colorClass="bg-blue-500" />
        <StatCard title="Total Applications" value={stats.totalApplications} colorClass="bg-green-500" />
        <StatCard title="Loan Types" value={stats.totalLoanTypes} colorClass="bg-purple-500" />
        <StatCard title="Total Amount Requested" value={`₹${Number(stats.totalAmountRequested).toLocaleString()}`} colorClass="bg-yellow-500" />
      </div>

      {/* Charts Section */}
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-dark-slate mb-4">Application Status Overview</h3>
        <div className="max-w-md mx-auto">
          <Pie data={pieChartData} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
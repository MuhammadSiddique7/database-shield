import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { HiOutlineShieldCheck, HiOutlineExclamationTriangle, HiOutlineXCircle, HiOutlineFolder } from 'react-icons/hi2';
import PageHeader from '../components/common/PageHeader';
import StatCard from '../components/dashboard/StatCard';
import QueryChart from '../components/dashboard/QueryChart';
import RiskDistribution from '../components/dashboard/RiskDistribution';
import ActivityTable from '../components/dashboard/ActivityTable';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getDashboardStats, getDashboardChart, getDashboardRecent, getProjects } from '../services/api';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');

  useEffect(() => {
    const fetchInitialProjects = async () => {
      try {
        const projRes = await getProjects();
        setProjects(projRes.data.data || projRes.data || []);
      } catch (error) {
        console.error('Failed to load projects');
      }
    };
    fetchInitialProjects();
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, chartRes, recentRes] = await Promise.all([
          getDashboardStats(selectedProject).catch(() => ({ data: { totalRequests: 0, safeRequests: 0, blockedRequests: 0, highRiskRequests: 0, totalProjects: 0 } })),
          getDashboardChart(7, selectedProject).catch(() => ({ data: { data: [] } })),
          getDashboardRecent(selectedProject).catch(() => ({ data: { data: [] } }))
        ]);

        setStats(statsRes.data.data || statsRes.data);
        setChartData(chartRes.data.data || []);
        setRecentLogs(recentRes.data.data || []);
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    const interval = setInterval(() => {
      fetchDashboardData();
    }, 5000); // Realtime updates every 5 seconds

    return () => clearInterval(interval);
  }, [selectedProject]);

  if (loading) return <LoadingSpinner text="Loading your analytics..." />;

  const statCards = [
    { title: 'Total Queries', value: stats?.totalRequests?.toLocaleString() || 0, icon: HiOutlineShieldCheck, color: 'cyan', trend: 12 },
    { title: 'Safe Queries', value: stats?.safeRequests?.toLocaleString() || 0, icon: HiOutlineShieldCheck, color: 'green', trend: 15 },
    { title: 'Blocked Attacks', value: stats?.blockedRequests?.toLocaleString() || 0, icon: HiOutlineXCircle, color: 'red', trend: -5 },
    { title: 'Active Projects', value: stats?.totalProjects || 0, icon: HiOutlineFolder, color: 'orange' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageHeader 
          title="Dashboard" 
          description="Overview of your database security analytics and recent activity."
        />
        <select 
          value={selectedProject} 
          onChange={(e) => setSelectedProject(e.target.value)} 
          className="input-field py-2 w-full sm:w-auto min-w-[200px]"
        >
          <option value="">All Projects</option>
          {projects.map(p => (
            <option key={p._id || p.id} value={p._id || p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <QueryChart data={chartData} />
        </div>
        <div>
          <RiskDistribution stats={{
            safe: stats?.safeRequests,
            low: Math.floor(((stats?.totalRequests || 0) - (stats?.safeRequests || 0)) * 0.3),
            medium: Math.floor(((stats?.totalRequests || 0) - (stats?.safeRequests || 0)) * 0.4),
            high: stats?.highRiskRequests,
            critical: stats?.blockedRequests
          }} />
        </div>
      </div>

      <div>
        <ActivityTable logs={recentLogs} />
      </div>
    </motion.div>
  );
};

export default Dashboard;

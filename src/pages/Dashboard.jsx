// Dashboard Page — real-time overview of crisis operations
// Demonstrates: useMemo, useCallback, conditional rendering, lists & keys, component composition
import { useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Users,
  Package,
  CheckCircle,
  Clock,
  TrendingUp,
  ArrowRight,
  Activity,
  Heart,
  Zap,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import { StatSkeleton, TableSkeleton } from '../components/common/Skeletons';
import { formatRelativeTime, capitalize } from '../utils/formatters';
import {
  MOCK_DAILY_REQUESTS,
  MOCK_CATEGORY_DISTRIBUTION,
  MOCK_RESPONSE_TIMES,
} from '../utils/mockData';

// Animation variants for staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Dashboard() {
  const { stats, requests } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Get recent critical/pending requests for the activity feed (demonstrates useMemo)
  const recentActivity = useMemo(() => {
    return requests
      .filter((r) => r.status !== 'resolved')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }, [requests]);

  // Status distribution for pie (demonstrates useMemo)
  const statusDistribution = useMemo(() => {
    return [
      { name: 'Pending', value: stats.pendingRequests, fill: '#ffc542' },
      { name: 'Active', value: stats.activeRequests, fill: '#ff6b35' },
      { name: 'Resolved', value: stats.resolvedRequests, fill: '#26de81' },
    ].filter((d) => d.value > 0);
  }, [stats]);

  const handleViewAll = useCallback(() => {
    navigate('/requests');
  }, [navigate]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <motion.div
        className="page-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1>
          {getGreeting()}, {user?.displayName?.split(' ')[0]} 👋
        </h1>
        <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="live-dot" />
          Live crisis dashboard — all systems operational
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="stats-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {loading ? (
          <>
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </>
        ) : (
          <>
            <motion.div className="stat-card critical" variants={itemVariants}>
              <div className="stat-icon critical">
                <Zap size={22} />
              </div>
              <div className="stat-content">
                <div className="stat-label">Critical Alerts</div>
                <div className="stat-value">{stats.criticalRequests}</div>
                <div className="stat-change negative">
                  <AlertTriangle size={12} /> Needs immediate attention
                </div>
              </div>
            </motion.div>

            <motion.div className="stat-card high" variants={itemVariants}>
              <div className="stat-icon high">
                <Clock size={22} />
              </div>
              <div className="stat-content">
                <div className="stat-label">Pending Requests</div>
                <div className="stat-value">{stats.pendingRequests}</div>
                <div className="stat-change negative">
                  <TrendingUp size={12} /> Awaiting assignment
                </div>
              </div>
            </motion.div>

            <motion.div className="stat-card success" variants={itemVariants}>
              <div className="stat-icon success">
                <CheckCircle size={22} />
              </div>
              <div className="stat-content">
                <div className="stat-label">Resolved</div>
                <div className="stat-value">{stats.resolvedRequests}</div>
                <div className="stat-change positive">
                  <TrendingUp size={12} /> {stats.totalRequests > 0 ? Math.round((stats.resolvedRequests / stats.totalRequests) * 100) : 0}% resolution rate
                </div>
              </div>
            </motion.div>

            <motion.div className="stat-card info" variants={itemVariants}>
              <div className="stat-icon info">
                <Users size={22} />
              </div>
              <div className="stat-content">
                <div className="stat-label">Active Volunteers</div>
                <div className="stat-value">{stats.activeVolunteers}</div>
                <div className="stat-change positive">
                  <Heart size={12} /> of {stats.totalVolunteers} total
                </div>
              </div>
            </motion.div>
          </>
        )}
      </motion.div>

      {/* Charts Row */}
      <motion.div
        className="charts-grid"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {/* Requests Trend Chart */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h3>Requests This Week</h3>
            <span className="badge info">
              <Activity size={12} /> Live
            </span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={MOCK_DAILY_REQUESTS}>
              <defs>
                <linearGradient id="requestGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff6b35" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ff6b35" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="resolvedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#26de81" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#26de81" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="requests"
                stroke="#ff6b35"
                fill="url(#requestGradient)"
                strokeWidth={2}
                name="New Requests"
              />
              <Area
                type="monotone"
                dataKey="resolved"
                stroke="#26de81"
                fill="url(#resolvedGradient)"
                strokeWidth={2}
                name="Resolved"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h3>Request Categories</h3>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={MOCK_CATEGORY_DISTRIBUTION}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {MOCK_CATEGORY_DISTRIBUTION.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
            {MOCK_CATEGORY_DISTRIBUTION.map((entry) => (
              <div
                key={entry.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: entry.fill,
                  }}
                />
                {entry.name}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Bottom Section — Activity Feed + Response Times */}
      <motion.div
        className="charts-grid"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        {/* Recent Activity Feed */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h3>Recent Activity</h3>
            <button className="btn btn-secondary btn-sm" onClick={handleViewAll}>
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {loading ? (
              <TableSkeleton rows={5} />
            ) : recentActivity.length === 0 ? (
              <div className="empty-state" style={{ padding: '32px 16px' }}>
                <p>No active requests</p>
              </div>
            ) : (
              recentActivity.map((request) => (
                <div
                  key={request.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    transition: 'background 0.15s',
                    cursor: 'pointer',
                  }}
                  className="data-table-row-hover"
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  onClick={() => navigate('/requests')}
                >
                  <span className={`badge ${request.priority}`}>
                    <span className="badge-dot" />
                    {capitalize(request.priority)}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {request.title}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                      {request.location}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 'var(--font-size-xs)',
                      color: 'var(--text-tertiary)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {formatRelativeTime(request.createdAt)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Response Time Chart */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h3>Avg. Response Time</h3>
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
              Minutes by hour
            </span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={MOCK_RESPONSE_TIMES}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avgMinutes" fill="#a55eea" radius={[4, 4, 0, 0]} name="Avg Minutes" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Impact Summary Bar */}
      <motion.div
        className="card"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '24px',
          flexWrap: 'wrap',
          gap: '24px',
          background: 'linear-gradient(135deg, rgba(255,107,53,0.08) 0%, rgba(165,94,234,0.08) 100%)',
          borderColor: 'rgba(255,107,53,0.15)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--accent-primary)' }}>
            {stats.totalPeopleAffected}
          </div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
            People Affected
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--status-low)' }}>
            {stats.resolvedRequests}
          </div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
            Requests Resolved
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--status-info)' }}>
            {stats.totalVolunteers}
          </div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
            Volunteers Deployed
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--status-medium)' }}>
            {stats.totalResources.toLocaleString()}
          </div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
            Resources in Stock
          </div>
        </div>
      </motion.div>
    </div>
  );
}

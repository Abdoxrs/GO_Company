import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Loader from '../../components/ui/Loader';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, FolderKanban, Award, UserX, AlertTriangle } from 'lucide-react';

const TABS = [
  { key: 'dept-stats', label: 'Department Stats', icon: Users },
  { key: 'proj-hours', label: 'Project Hours', icon: FolderKanban },
  { key: 'emp-hours', label: 'Employee Hours', icon: Users },
  { key: 'top-supervisors', label: 'Top Supervisors', icon: Award },
  { key: 'no-supervisor', label: 'Without Supervisor', icon: UserX },
  { key: 'unstaffed', label: 'Unstaffed Projects', icon: AlertTriangle },
];

const chartTooltipStyle = {
  backgroundColor: '#1a1a2e',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
  color: '#f0f0f5',
  fontSize: '0.85rem',
};

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState('dept-stats');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const endpoints = {
    'dept-stats': '/reports/departments/stats',
    'proj-hours': '/reports/projects/hours',
    'emp-hours': '/reports/employees/hours',
    'top-supervisors': '/reports/employees/top-supervisors?limit=10',
    'no-supervisor': '/reports/employees/without-supervisor',
    'unstaffed': '/reports/projects/unstaffed',
  };

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const res = await api.get(endpoints[activeTab]);
        const d = res.data.data || res.data;
        setData(Array.isArray(d) ? d : []);
      } catch (err) {
        toast.error('Failed to load report');
        setData([]);
      }
      setLoading(false);
    };
    fetchReport();
  }, [activeTab]);

  const renderContent = () => {
    if (loading) return <Loader size="lg" />;
    if (data.length === 0) return <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>No data available for this report</p>;

    switch (activeTab) {
      case 'dept-stats':
        return (
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.map(d => ({ name: d.departmentName || 'Unassigned', employees: d.employeeCount, avgSalary: Math.round(d.avgSalary || 0) }))} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fill: '#9494b0', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} tickLine={false} />
                <YAxis tick={{ fill: '#9494b0', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} tickLine={false} />
                <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: 'rgba(108, 92, 231, 0.08)' }} />
                <Bar dataKey="employees" fill="#6c5ce7" radius={[6, 6, 0, 0]} name="Employees" maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ overflowX: 'auto', marginTop: '20px' }}>
              <table>
                <thead><tr><th>Department</th><th>Employees</th><th>Avg Salary</th><th>Total Salary</th><th>Min</th><th>Max</th></tr></thead>
                <tbody>
                  {data.map((d, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600 }}>{d.departmentName || 'Unassigned'}</td>
                      <td><Badge type="default">{d.employeeCount}</Badge></td>
                      <td style={{ color: 'var(--success)' }}>${Math.round(d.avgSalary || 0).toLocaleString()}</td>
                      <td>${(d.totalSalary || 0).toLocaleString()}</td>
                      <td>${(d.minSalary || 0).toLocaleString()}</td>
                      <td>${(d.maxSalary || 0).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'proj-hours':
        return (
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.map(d => ({ name: d.projectName, hours: d.totalHours, employees: d.employeeCount }))} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fill: '#9494b0', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} tickLine={false} />
                <YAxis tick={{ fill: '#9494b0', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} tickLine={false} />
                <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: 'rgba(0, 206, 201, 0.08)' }} />
                <Bar dataKey="hours" fill="#00cec9" radius={[6, 6, 0, 0]} name="Total Hours" maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ overflowX: 'auto', marginTop: '20px' }}>
              <table>
                <thead><tr><th>Project</th><th>#</th><th>Total Hours</th><th>Employees</th></tr></thead>
                <tbody>
                  {data.map((d, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600 }}>{d.projectName}</td>
                      <td><Badge type="default">#{d.projectNumber}</Badge></td>
                      <td style={{ color: 'var(--accent-secondary)' }}>{d.totalHours} hrs</td>
                      <td>{d.employeeCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'emp-hours':
        return (
          <table>
            <thead><tr><th>Employee</th><th>SSN</th><th>Total Hours</th><th>Projects</th></tr></thead>
            <tbody>
              {data.map((d, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{d.employeeName}</td>
                  <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{d.ssn}</td>
                  <td style={{ color: 'var(--accent-secondary)' }}>{d.totalHours} hrs</td>
                  <td><Badge type="default">{d.projectCount} projects</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case 'top-supervisors':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {data.map((sup, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 18px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: i < 3 ? 'var(--accent-gradient)' : 'var(--bg-glass-hover)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.85rem', fontWeight: 700, color: '#fff',
                  }}>#{i + 1}</div>
                  <div>
                    <p style={{ fontWeight: 600 }}>{sup.name?.fname} {sup.name?.lname}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>SSN: {sup.ssn}</p>
                  </div>
                </div>
                <Badge type="admin">{sup.subordinateCount} subordinates</Badge>
              </div>
            ))}
          </div>
        );

      case 'no-supervisor':
        return (
          <table>
            <thead><tr><th>Name</th><th>SSN</th><th>Department</th><th>Salary</th></tr></thead>
            <tbody>
              {data.map((emp, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{emp.name?.fname} {emp.name?.lname}</td>
                  <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{emp.ssn}</td>
                  <td>{emp.deptNo?.name || '—'}</td>
                  <td style={{ color: 'var(--success)' }}>${(emp.salary || 0).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case 'unstaffed':
        return (
          <table>
            <thead><tr><th>Project</th><th>#</th><th>Location</th></tr></thead>
            <tbody>
              {data.map((proj, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{proj.name}</td>
                  <td><Badge type="warning">#{proj.number}</Badge></td>
                  <td style={{ color: 'var(--text-secondary)' }}>{proj.location || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      default:
        return null;
    }
  };

  return (
    <Layout title="Reports & Analytics">
      {/* Tabs */}
      <div style={{
        display: 'flex', gap: '4px', marginBottom: '24px', overflowX: 'auto',
        background: 'var(--bg-glass)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '6px',
      }}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '10px 18px', borderRadius: 'var(--radius-sm)', border: 'none',
              background: activeTab === tab.key ? 'var(--accent-gradient)' : 'transparent',
              color: activeTab === tab.key ? '#fff' : 'var(--text-secondary)',
              fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
              fontFamily: 'inherit', transition: 'all var(--transition-normal)',
              display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap',
              boxShadow: activeTab === tab.key ? 'var(--shadow-glow)' : 'none',
            }}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      <Card>{renderContent()}</Card>
    </Layout>
  );
};

export default ReportsPage;

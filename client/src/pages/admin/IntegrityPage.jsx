import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { ShieldCheck, AlertTriangle, RefreshCw } from 'lucide-react';

const IntegrityPage = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const runCheck = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/check-integrity');
      const data = res.data.data || res.data;
      setResult(data);
      toast.success('Integrity check completed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to run integrity check');
    }
    setLoading(false);
  };

  return (
    <Layout title="Data Integrity">
      <div style={{ maxWidth: '700px' }}>
        <Card>
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: result
                ? (result.orphanedDependents === 0 ? 'var(--success-bg)' : 'var(--warning-bg)')
                : 'var(--bg-glass-hover)',
              border: `2px solid ${result ? (result.orphanedDependents === 0 ? 'var(--success)' : 'var(--warning)') : 'var(--border)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
              transition: 'all var(--transition-normal)',
            }}>
              {result ? (
                result.orphanedDependents === 0
                  ? <ShieldCheck size={32} style={{ color: 'var(--success)' }} />
                  : <AlertTriangle size={32} style={{ color: 'var(--warning)' }} />
              ) : (
                <ShieldCheck size={32} style={{ color: 'var(--text-muted)' }} />
              )}
            </div>

            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>
              {result
                ? (result.orphanedDependents === 0 ? 'All Clear!' : 'Issues Found')
                : 'Data Integrity Check'
              }
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '28px', maxWidth: '400px', margin: '0 auto 28px' }}>
              {result
                ? (result.orphanedDependents === 0
                  ? 'No orphaned data found. Your database is clean.'
                  : `Found ${result.orphanedDependents} orphaned dependent(s) that were cleaned up.`)
                : 'Run a check to scan for orphaned dependents and other data inconsistencies.'
              }
            </p>

            <Button
              onClick={runCheck}
              loading={loading}
              icon={<RefreshCw size={16} />}
              size="lg"
            >
              {result ? 'Run Again' : 'Run Integrity Check'}
            </Button>
          </div>

          {/* Orphaned Data Details */}
          {result && result.orphanedData && result.orphanedData.length > 0 && (
            <div style={{ marginTop: '28px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '12px', color: 'var(--text-primary)' }}>
                Cleaned Orphaned Records
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {result.orphanedData.map((item, i) => (
                  <div key={i} style={{
                    padding: '10px 14px', background: 'var(--bg-glass)',
                    borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <span style={{ fontSize: '0.9rem' }}>{item.name || item._id}</span>
                    <Badge type="warning">orphaned</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default IntegrityPage;

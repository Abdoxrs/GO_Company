import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Loader from '../../components/ui/Loader';
import Modal from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';

const DependentsPage = () => {
  const [dependents, setDependents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteModal, setDeleteModal] = useState({ open: false, dep: null });
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const fetchDependents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/dependents?pageSize=1000');
      const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
      setDependents(data);
    } catch (err) { toast.error('Failed to load dependents'); }
    setLoading(false);
  };

  useEffect(() => { fetchDependents(); }, []);

  const handleDelete = async () => {
    try {
      await api.delete(`/dependents/${deleteModal.dep._id}`);
      toast.success('Dependent deleted');
      setDeleteModal({ open: false, dep: null });
      fetchDependents();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to delete'); }
  };

  const filtered = dependents.filter(d => {
    if (!search) return true;
    return d.name?.toLowerCase().includes(search.toLowerCase()) || (d.relationship || '').toLowerCase().includes(search.toLowerCase());
  });

  return (
    <Layout title="Dependents">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ position: 'relative', flex: '1', maxWidth: '400px' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input type="text" placeholder="Search dependents..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '42px', width: '100%' }} />
        </div>
        {isAdmin() && <Button icon={<Plus size={18} />} onClick={() => navigate('/dependents/new')}>Add Dependent</Button>}
      </div>

      {loading ? <Loader size="lg" /> : (
        <Card>
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Sex</th>
                  <th>Birth Date</th>
                  <th>Relationship</th>
                  <th>Employee</th>
                  {isAdmin() && <th style={{ textAlign: 'right' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={isAdmin() ? 6 : 5} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No dependents found</td></tr>
                ) : (
                  filtered.map(dep => (
                    <tr key={dep._id}>
                      <td style={{ fontWeight: 600 }}>{dep.name}</td>
                      <td><Badge type={dep.sex}>{dep.sex}</Badge></td>
                      <td style={{ color: 'var(--text-secondary)' }}>{dep.birthDate ? new Date(dep.birthDate).toLocaleDateString() : '—'}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{dep.relationship || '—'}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>
                        {dep.employeeId?.name ? `${dep.employeeId.name.fname} ${dep.employeeId.name.lname}` : (dep.employeeId || '—')}
                      </td>
                      {isAdmin() && (
                        <td>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                            <Button variant="secondary" size="sm" icon={<Edit size={14} />} onClick={() => navigate(`/dependents/${dep._id}/edit`)}>Edit</Button>
                            <Button variant="danger" size="sm" icon={<Trash2 size={14} />} onClick={() => setDeleteModal({ open: true, dep })}>Delete</Button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, dep: null })} title="Delete Dependent" size="sm"
        footer={<><Button variant="secondary" onClick={() => setDeleteModal({ open: false, dep: null })}>Cancel</Button><Button variant="danger" onClick={handleDelete}>Delete</Button></>}
      >
        <p style={{ color: 'var(--text-secondary)' }}>Are you sure you want to delete <strong style={{ color: 'var(--text-primary)' }}>{deleteModal.dep?.name}</strong>?</p>
      </Modal>
    </Layout>
  );
};

export default DependentsPage;

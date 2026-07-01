import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Loader from '../../components/ui/Loader';
import Modal from '../../components/ui/Modal';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Search, Trash2, Shield } from 'lucide-react';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteModal, setDeleteModal] = useState({ open: false, user: null });
  const [roleModal, setRoleModal] = useState({ open: false, user: null, newRole: '' });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users');
      const data = res.data.data || res.data;
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) { toast.error('Failed to load users'); }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async () => {
    try {
      await api.delete(`/users/${deleteModal.user._id}`);
      toast.success('User deleted');
      setDeleteModal({ open: false, user: null });
      fetchUsers();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to delete'); }
  };

  const handleRoleChange = async () => {
    try {
      await api.patch(`/users/${roleModal.user._id}`, { role: roleModal.newRole });
      toast.success('Role updated');
      setRoleModal({ open: false, user: null, newRole: '' });
      fetchUsers();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update role'); }
  };

  const filtered = users.filter(u => {
    if (!search) return true;
    return u.email?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <Layout title="Manage Users">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ position: 'relative', flex: '1', maxWidth: '400px' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input type="text" placeholder="Search users by email..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '42px', width: '100%' }} />
        </div>
      </div>

      {loading ? <Loader size="lg" /> : (
        <Card>
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No users found</td></tr>
                ) : (
                  filtered.map(u => (
                    <tr key={u._id}>
                      <td style={{ fontWeight: 600 }}>{u.email}</td>
                      <td><Badge type={u.role}>{u.role}</Badge></td>
                      <td style={{ color: 'var(--text-secondary)' }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <Button
                            variant="secondary" size="sm" icon={<Shield size={14} />}
                            onClick={() => setRoleModal({ open: true, user: u, newRole: u.role === 'admin' ? 'user' : 'admin' })}
                          >
                            {u.role === 'admin' ? 'Demote' : 'Promote'}
                          </Button>
                          <Button variant="danger" size="sm" icon={<Trash2 size={14} />} onClick={() => setDeleteModal({ open: true, user: u })}>Delete</Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Role Change Modal */}
      <Modal isOpen={roleModal.open} onClose={() => setRoleModal({ open: false, user: null, newRole: '' })} title="Change User Role" size="sm"
        footer={<><Button variant="secondary" onClick={() => setRoleModal({ open: false, user: null, newRole: '' })}>Cancel</Button><Button onClick={handleRoleChange}>Confirm</Button></>}
      >
        <p style={{ color: 'var(--text-secondary)' }}>
          Change <strong style={{ color: 'var(--text-primary)' }}>{roleModal.user?.email}</strong> role to <Badge type={roleModal.newRole}>{roleModal.newRole}</Badge>?
        </p>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, user: null })} title="Delete User" size="sm"
        footer={<><Button variant="secondary" onClick={() => setDeleteModal({ open: false, user: null })}>Cancel</Button><Button variant="danger" onClick={handleDelete}>Delete</Button></>}
      >
        <p style={{ color: 'var(--text-secondary)' }}>
          Permanently delete <strong style={{ color: 'var(--text-primary)' }}>{deleteModal.user?.email}</strong>? This cannot be undone.
        </p>
      </Modal>
    </Layout>
  );
};

export default UsersPage;

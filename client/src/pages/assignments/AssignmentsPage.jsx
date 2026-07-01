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
import { Plus, Search, Edit, Trash2, Clock } from 'lucide-react';

const AssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteModal, setDeleteModal] = useState({ open: false, assignment: null });
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/works-on?pageSize=1000');
      const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
      setAssignments(data);
    } catch (err) { toast.error('Failed to load assignments'); }
    setLoading(false);
  };

  useEffect(() => { fetchAssignments(); }, []);

  const handleDelete = async () => {
    try {
      await api.delete(`/works-on/${deleteModal.assignment._id}`);
      toast.success('Assignment deleted');
      setDeleteModal({ open: false, assignment: null });
      fetchAssignments();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to delete'); }
  };

  const getEmployeeName = (a) => {
    if (a.employeeId?.name) return `${a.employeeId.name.fname} ${a.employeeId.name.lname}`;
    return a.employeeId || 'Unknown';
  };

  const getProjectName = (a) => {
    if (a.projectId?.name) return a.projectId.name;
    return a.projectId || 'Unknown';
  };

  const filtered = assignments.filter(a => {
    if (!search) return true;
    const empName = getEmployeeName(a).toString().toLowerCase();
    const projName = getProjectName(a).toString().toLowerCase();
    return empName.includes(search.toLowerCase()) || projName.includes(search.toLowerCase());
  });

  return (
    <Layout title="Work Assignments">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ position: 'relative', flex: '1', maxWidth: '400px' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input type="text" placeholder="Search by employee or project..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '42px', width: '100%' }} />
        </div>
        {isAdmin() && <Button icon={<Plus size={18} />} onClick={() => navigate('/assignments/new')}>New Assignment</Button>}
      </div>

      {loading ? <Loader size="lg" /> : (
        <Card>
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Project</th>
                  <th>Hours</th>
                  {isAdmin() && <th style={{ textAlign: 'right' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={isAdmin() ? 4 : 3} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No assignments found</td></tr>
                ) : (
                  filtered.map(a => (
                    <tr key={a._id}>
                      <td style={{ fontWeight: 600 }}>{getEmployeeName(a)}</td>
                      <td>{getProjectName(a)}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-secondary)' }}>
                          <Clock size={14} /> {a.hours} hrs
                        </div>
                      </td>
                      {isAdmin() && (
                        <td>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                            <Button variant="secondary" size="sm" icon={<Edit size={14} />} onClick={() => navigate(`/assignments/${a._id}/edit`)}>Edit</Button>
                            <Button variant="danger" size="sm" icon={<Trash2 size={14} />} onClick={() => setDeleteModal({ open: true, assignment: a })}>Delete</Button>
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

      <Modal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, assignment: null })} title="Delete Assignment" size="sm"
        footer={<><Button variant="secondary" onClick={() => setDeleteModal({ open: false, assignment: null })}>Cancel</Button><Button variant="danger" onClick={handleDelete}>Delete</Button></>}
      >
        <p style={{ color: 'var(--text-secondary)' }}>Are you sure you want to remove this work assignment?</p>
      </Modal>
    </Layout>
  );
};

export default AssignmentsPage;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';

const AssignmentFormPage = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ employeeId: '', projectId: '', hours: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, projRes] = await Promise.all([
          api.get('/employees?pageSize=1000'),
          api.get('/projects?pageSize=1000'),
        ]);
        const emps = Array.isArray(empRes.data) ? empRes.data : (empRes.data.data || []);
        const projs = Array.isArray(projRes.data) ? projRes.data : (projRes.data.data || []);
        setEmployees(emps);
        setProjects(projs);

        if (isEdit) {
          const res = await api.get(`/works-on/${id}`);
          const a = res.data.data || res.data;
          setForm({
            employeeId: a.employeeId?._id || a.employeeId || '',
            projectId: a.projectId?._id || a.projectId || '',
            hours: a.hours || '',
          });
        }
      } catch (err) { toast.error('Failed to load data'); }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { employeeId: form.employeeId, projectId: form.projectId, hours: Number(form.hours) };
    try {
      if (isEdit) {
        await api.patch(`/works-on/${id}`, payload);
        toast.success('Assignment updated');
      } else {
        await api.post('/works-on', payload);
        toast.success('Assignment created');
      }
      navigate('/assignments');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save assignment'); }
    setSaving(false);
  };

  if (loading) return <Layout title={isEdit ? 'Edit Assignment' : 'New Assignment'}><Loader size="lg" /></Layout>;

  return (
    <Layout title={isEdit ? 'Edit Assignment' : 'New Assignment'}>
      <Button variant="secondary" size="sm" icon={<ArrowLeft size={16} />} onClick={() => navigate('/assignments')} style={{ marginBottom: '24px' }}>Back to Assignments</Button>
      <Card style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label>Employee *</label>
            <select name="employeeId" value={form.employeeId} onChange={handleChange} required style={{ padding: '12px 16px' }}>
              <option value="">— Select Employee —</option>
              {employees.map(emp => (
                <option key={emp._id} value={emp._id}>
                  {emp.name?.fname} {emp.name?.lname} ({emp.ssn})
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label>Project *</label>
            <select name="projectId" value={form.projectId} onChange={handleChange} required style={{ padding: '12px 16px' }}>
              <option value="">— Select Project —</option>
              {projects.map(proj => (
                <option key={proj._id} value={proj._id}>{proj.name} (#{proj.number})</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label>Hours per Week *</label>
            <input type="number" name="hours" value={form.hours} onChange={handleChange} required min="0" max="168" placeholder="Hours" />
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => navigate('/assignments')}>Cancel</Button>
            <Button type="submit" icon={<Save size={16} />} loading={saving}>{isEdit ? 'Update' : 'Create'} Assignment</Button>
          </div>
        </form>
      </Card>
    </Layout>
  );
};

export default AssignmentFormPage;

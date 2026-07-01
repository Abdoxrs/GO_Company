import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';

const ProjectFormPage = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({ number: '', name: '', location: '', controllingDept: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const deptRes = await api.get('/departments?pageSize=1000');
        const d = Array.isArray(deptRes.data) ? deptRes.data : (deptRes.data.data || []);
        setDepartments(d);

        if (isEdit) {
          const projRes = await api.get(`/projects/${id}`);
          const proj = projRes.data.data || projRes.data;
          setForm({
            number: proj.number || '',
            name: proj.name || '',
            location: proj.location || '',
            controllingDept: proj.controllingDept?._id || proj.controllingDept || '',
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
    const payload = {
      number: Number(form.number),
      name: form.name,
      location: form.location || undefined,
      controllingDept: form.controllingDept || undefined,
    };
    try {
      if (isEdit) {
        await api.patch(`/projects/${id}`, payload);
        toast.success('Project updated');
      } else {
        await api.post('/projects', payload);
        toast.success('Project created');
      }
      navigate('/projects');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save project'); }
    setSaving(false);
  };

  if (loading) return <Layout title={isEdit ? 'Edit Project' : 'New Project'}><Loader size="lg" /></Layout>;

  return (
    <Layout title={isEdit ? 'Edit Project' : 'New Project'}>
      <Button variant="secondary" size="sm" icon={<ArrowLeft size={16} />} onClick={() => navigate('/projects')} style={{ marginBottom: '24px' }}>Back to Projects</Button>
      <Card style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div><label>Project Name *</label><input name="name" value={form.name} onChange={handleChange} required placeholder="Project name" /></div>
            <div><label>Project Number *</label><input type="number" name="number" value={form.number} onChange={handleChange} required placeholder="Unique number" /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div><label>Location</label><input name="location" value={form.location} onChange={handleChange} placeholder="Project location" /></div>
            <div>
              <label>Controlling Department</label>
              <select name="controllingDept" value={form.controllingDept} onChange={handleChange} style={{ padding: '12px 16px' }}>
                <option value="">— None —</option>
                {departments.map(dept => (<option key={dept._id} value={dept._id}>{dept.name} (#{dept.number})</option>))}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => navigate('/projects')}>Cancel</Button>
            <Button type="submit" icon={<Save size={16} />} loading={saving}>{isEdit ? 'Update Project' : 'Create Project'}</Button>
          </div>
        </form>
      </Card>
    </Layout>
  );
};

export default ProjectFormPage;

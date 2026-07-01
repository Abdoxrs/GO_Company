import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';

const DependentFormPage = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ employeeId: '', name: '', sex: 'Male', birthDate: '', relationship: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const empRes = await api.get('/employees?pageSize=1000');
        const emps = Array.isArray(empRes.data) ? empRes.data : (empRes.data.data || []);
        setEmployees(emps);

        if (isEdit) {
          const res = await api.get(`/dependents/${id}`);
          const dep = res.data.data || res.data;
          setForm({
            employeeId: dep.employeeId?._id || dep.employeeId || '',
            name: dep.name || '',
            sex: dep.sex || 'Male',
            birthDate: dep.birthDate ? dep.birthDate.substring(0, 10) : '',
            relationship: dep.relationship || '',
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
      employeeId: form.employeeId,
      name: form.name,
      sex: form.sex,
      birthDate: form.birthDate || undefined,
      relationship: form.relationship || undefined,
    };
    try {
      if (isEdit) {
        await api.patch(`/dependents/${id}`, payload);
        toast.success('Dependent updated');
      } else {
        await api.post('/dependents', payload);
        toast.success('Dependent created');
      }
      navigate('/dependents');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save dependent'); }
    setSaving(false);
  };

  if (loading) return <Layout title={isEdit ? 'Edit Dependent' : 'New Dependent'}><Loader size="lg" /></Layout>;

  return (
    <Layout title={isEdit ? 'Edit Dependent' : 'New Dependent'}>
      <Button variant="secondary" size="sm" icon={<ArrowLeft size={16} />} onClick={() => navigate('/dependents')} style={{ marginBottom: '24px' }}>Back to Dependents</Button>
      <Card style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label>Employee *</label>
            <select name="employeeId" value={form.employeeId} onChange={handleChange} required style={{ padding: '12px 16px' }}>
              <option value="">— Select Employee —</option>
              {employees.map(emp => (
                <option key={emp._id} value={emp._id}>{emp.name?.fname} {emp.name?.lname} ({emp.ssn})</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div><label>Dependent Name *</label><input name="name" value={form.name} onChange={handleChange} required placeholder="Full name" /></div>
            <div>
              <label>Sex *</label>
              <select name="sex" value={form.sex} onChange={handleChange} required style={{ padding: '12px 16px' }}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div><label>Birth Date</label><input type="date" name="birthDate" value={form.birthDate} onChange={handleChange} /></div>
            <div><label>Relationship</label><input name="relationship" value={form.relationship} onChange={handleChange} placeholder="e.g. Son, Daughter, Spouse" /></div>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={() => navigate('/dependents')}>Cancel</Button>
            <Button type="submit" icon={<Save size={16} />} loading={saving}>{isEdit ? 'Update' : 'Create'} Dependent</Button>
          </div>
        </form>
      </Card>
    </Layout>
  );
};

export default DependentFormPage;

import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Mail, Lock, Save, Shield } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [emailForm, setEmailForm] = useState({ email: user?.email || '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', newPasswordConfirmation: '' });
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    setSavingEmail(true);
    const result = await updateProfile({ email: emailForm.email });
    if (result.success) toast.success('Email updated');
    else toast.error(result.message);
    setSavingEmail(false);
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.newPasswordConfirmation) {
      toast.error('Passwords do not match');
      return;
    }
    setSavingPassword(true);
    try {
      await api.patch('/users/update-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        newPasswordConfirmation: passwordForm.newPasswordConfirmation,
      });
      toast.success('Password updated');
      setPasswordForm({ currentPassword: '', newPassword: '', newPasswordConfirmation: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    }
    setSavingPassword(false);
  };

  return (
    <Layout title="Profile">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px', maxWidth: '900px' }}>
        {/* Profile Info */}
        <Card title="Account Information" icon={<Shield size={18} />}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%', background: 'var(--accent-gradient)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.4rem', fontWeight: 700, color: '#fff',
              boxShadow: 'var(--shadow-glow)',
            }}>
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{user?.email?.split('@')[0]}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '6px' }}>{user?.email}</p>
              <Badge type={user?.role}>{user?.role}</Badge>
            </div>
          </div>

          <form onSubmit={handleUpdateEmail}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Email Address
            </label>
            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="email" value={emailForm.email} onChange={e => setEmailForm({ email: e.target.value })} required style={{ paddingLeft: '42px' }} />
            </div>
            <Button type="submit" size="sm" icon={<Save size={14} />} loading={savingEmail}>Update Email</Button>
          </form>
        </Card>

        {/* Change Password */}
        <Card title="Change Password" icon={<Lock size={18} />}>
          <form onSubmit={handleUpdatePassword}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Current Password</label>
              <input type="password" value={passwordForm.currentPassword} onChange={e => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))} required placeholder="Enter current password" />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>New Password</label>
              <input type="password" value={passwordForm.newPassword} onChange={e => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))} required placeholder="Min 8 characters" minLength={8} />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Confirm New Password</label>
              <input type="password" value={passwordForm.newPasswordConfirmation} onChange={e => setPasswordForm(prev => ({ ...prev, newPasswordConfirmation: e.target.value }))} required placeholder="Re-enter new password" />
            </div>
            <Button type="submit" size="sm" icon={<Save size={14} />} loading={savingPassword}>Update Password</Button>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default ProfilePage;

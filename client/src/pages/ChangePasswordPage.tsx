import { Button, Flex, Input } from 'antd';
import { useState } from 'react';
import { toast } from 'sonner';
import { useChangePasswordMutation } from '../redux/features/authApi';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, LockOutlined } from '@ant-design/icons';

const ChangePasswordPage = () => {
  const [changePassword] = useChangePasswordMutation();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('All fields are required');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must have 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Password and confirm password does not match');
      return;
    }

    const payload = {
      oldPassword,
      newPassword,
      confirmPassword,
    };

    try {
      const toastId = toast.loading('Changing password...');
      const res = await changePassword(payload).unwrap();

      if (res.success) {
        toast.success('Password changed successfully', { id: toastId });
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        navigate('/profile');
      }
    } catch (error: any) {
      toast.error(error.data.message, { id: error.data.statusCode });
    }
  };

  return (
    <div className="change-password-page">
      <div className="change-password-card">
        <div className="change-password-header">
          <LockOutlined className="lock-icon" />
          <h2>Change Password</h2>
          <p>Update your account password securely</p>
        </div>

        <Flex vertical gap={12}>
          <Input.Password
            size="large"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="password-input"
          />

          <Input.Password
            size="large"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="password-input"
          />

          <Input.Password
            size="large"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="password-input"
          />

          <Button
            type="primary"
            onClick={handleSubmit}
            disabled={true}
            className="change-password-btn"
          >
            Change Password
          </Button>

          <Button
            type="default"
            onClick={() => navigate('/profile')}
            className="back-btn"
          >
            <ArrowLeftOutlined /> Go Back
          </Button>
        </Flex>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
import { SpinnerIcon } from '@phosphor-icons/react';
import { Button, Flex } from 'antd';
import { FieldValues, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toastMessage from '../../lib/toastMessage';
import { useLoginMutation } from '../../redux/features/authApi';
import { useAppDispatch } from '../../redux/hooks';
import { loginUser } from '../../redux/services/authSlice';
import decodeToken from '../../utils/decodeToken';

const LoginPage = () => {
  const [userLogin, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: 'test-visitor@gmail.com',
      password: 'pass123',
    },
  });

  const onSubmit = async (data: FieldValues) => {
    try {
      const res = await userLogin(data).unwrap();

      if (res.statusCode === 200) {
        const user = decodeToken(res.data.token);
        dispatch(loginUser({ token: res.data.token, user }));
        navigate('/');
        toastMessage({ icon: 'success', text: 'Successfully Login!' });
      }
    } catch (error: any) {
      toastMessage({ icon: 'error', text: error.data.message });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Login</h1>
          <p>Welcome back! Please login to continue</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <input
            type="text"
            {...register('email', { required: true })}
            placeholder="Enter email address"
            className={`input-field modern-input auth-input ${
              errors['email'] ? 'input-field-error' : ''
            }`}
          />

          <input
            type="password"
            placeholder="Enter password"
            className={`input-field modern-input auth-input ${
              errors['password'] ? 'input-field-error' : ''
            }`}
            {...register('password', { required: true })}
          />

          <Flex justify="center">
            <Button
              htmlType="submit"
              type="primary"
              disabled={isLoading}
              className="auth-submit-btn"
            >
              {isLoading && <SpinnerIcon className="spin" weight="bold" />}
              Login
            </Button>
          </Flex>
        </form>

        <p className="auth-footer-text">
          Don&apos;t have any account? <Link to="/register">Register Here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
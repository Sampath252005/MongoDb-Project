import { SpinnerIcon } from '@phosphor-icons/react';
import { Button, Flex } from 'antd';
import { FieldValues, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toastMessage from '../../lib/toastMessage';
import { useRegisterMutation } from '../../redux/features/authApi';
import { useAppDispatch } from '../../redux/hooks';
import { loginUser } from '../../redux/services/authSlice';
import decodeToken from '../../utils/decodeToken';

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [userRegistration, { isLoading }] = useRegisterMutation();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: FieldValues) => {
    try {
      const res = await userRegistration(data).unwrap();

      if (data.password !== data.confirmPassword) {
        toastMessage({ icon: 'error', text: 'Password and confirm password must be same!' });
        return;
      }

      if (res.statusCode === 201) {
        const user = decodeToken(res.data.token);
        dispatch(loginUser({ token: res.data.token, user }));
        navigate('/');
        console.log(res);
        toastMessage({ icon: 'success', text: res.message });
      }
    } catch (error: any) {
      const errMsg =
        error?.data?.errors?.[Object.keys(error?.data?.errors)[0]] || error.data.message;
      toastMessage({ icon: 'error', text: errMsg });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Register</h1>
          <p>Create your account to start managing inventory</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <input
            type="text"
            {...register('name', { required: true })}
            placeholder="Enter your name"
            className={`input-field modern-input auth-input ${
              errors['name'] ? 'input-field-error' : ''
            }`}
          />

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
            {...register('password', { required: true })}
            className={`input-field modern-input auth-input ${
              errors['password'] ? 'input-field-error' : ''
            }`}
          />

          <input
            type="password"
            placeholder="Confirm password"
            {...register('confirmPassword', { required: true })}
            className={`input-field modern-input auth-input ${
              errors['confirmPassword'] ? 'input-field-error' : ''
            }`}
          />

          <Flex justify="center">
            <Button
              htmlType="submit"
              type="primary"
              disabled={isLoading}
              className="auth-submit-btn"
            >
              {isLoading && <SpinnerIcon className="spin" weight="bold" />}
              Register
            </Button>
          </Flex>
        </form>

        <p className="auth-footer-text">
          Already have an account? <Link to="/login">Login Here</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
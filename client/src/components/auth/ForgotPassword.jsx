import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useForgotPasswordMutation } from '../../features/auth/authApiSlice';
import { validateEmail } from '../../utils/validators';
import FormInput from '../common/FormInput';
import SubmitButton from '../common/SubmitButton';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    const validationErrors = {};
    if (!email) validationErrors.email = 'Email is required';
    else if (!validateEmail(email)) validationErrors.email = 'Invalid email format';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      // Call forgot password API
      const response = await forgotPassword({ email }).unwrap();
      
      toast.success(response.message || 'Password reset link sent to your email');
      navigate('/login'); // Redirect to login page
    } catch (err) {
      toast.error(err.data?.message || 'Failed to send reset link');
      setErrors({
        form: err.data?.message || 'An error occurred. Please try again.'
      });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Forgot Password
      </h2>
      
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Email Address"
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          placeholder="Enter your registered email"
          required
        />

        {errors.form && (
          <div className="mb-4 text-red-500 text-sm">{errors.form}</div>
        )}

        <SubmitButton
          text={isLoading ? 'Sending...' : 'Send Reset Link'}
          disabled={isLoading}
        />

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Back to Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
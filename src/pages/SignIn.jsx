import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Footer from '../components/Footer';

function SignIn({ onSignIn, loading }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignIn = () => {
    onSignIn(formData);
  };

  const navigateToSignUp = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl mb-6">
            <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
          <p className="text-gray-600">Sign in to your CrowdFunding Pro account</p>
        </div>

        {/* Enhanced Login Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          <div className='space-y-6'>
            <InputField 
              par='Email' 
              classname='emailField' 
              inputtype='email' 
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <InputField 
              par='Password' 
              classname='passwordField' 
              inputtype='password' 
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />  
          </div>
          
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                name="remember" 
                id="remember"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a href="#blank" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                Forgot password?
              </a>
            </div>
          </div>

          <div className='mt-8'>
            <Button text='Sign In' callfunc={handleSignIn} loading={loading} />
          </div>

          <div className='mt-6 text-center'>
            <Footer 
              onNavigate={navigateToSignUp}
              textOne="Don't have an account? "
              textTwo="Sign up"
            />
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            By signing in, you agree to our{' '}
            <a href="#terms" className="text-blue-600 hover:text-blue-500">Terms of Service</a>
            {' '}and{' '}
            <a href="#privacy" className="text-blue-600 hover:text-blue-500">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
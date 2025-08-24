import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Footer from '../components/Footer';

function SignUp({ onSignUp, loading }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignUp = () => {
    onSignUp(formData);
  };

  const navigateToSignIn = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-r from-green-600 to-teal-600 rounded-full flex items-center justify-center shadow-2xl mb-6">
            <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join CrowdFunding Pro and start your journey</p>
        </div>

        {/* Enhanced Signup Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          <div className='space-y-6'>
            <InputField 
              par='Username' 
              classname='usernameField' 
              inputtype='text' 
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />
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
            <InputField 
              par='Confirm Password' 
              classname='passwordField' 
              inputtype='password' 
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />  
          </div>
          
          <div className='mt-8'>
            <Button text='Create Account' callfunc={handleSignUp} loading={loading} />
          </div>
          
          <div className='mt-6 text-center'>
            <Footer 
              onNavigate={navigateToSignIn}
              textOne="Already have an account? "
              textTwo="Sign In"
            />
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            By creating an account, you agree to our{' '}
            <a href="#terms" className="text-green-600 hover:text-green-500">Terms of Service</a>
            {' '}and{' '}
            <a href="#privacy" className="text-green-600 hover:text-green-500">Privacy Policy</a>
          </p>
        </div>

        {/* Features */}
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Why Choose CrowdFunding Pro?</h3>
          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Secure and transparent crowdfunding
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Risk intelligence and analytics
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Global community of creators
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
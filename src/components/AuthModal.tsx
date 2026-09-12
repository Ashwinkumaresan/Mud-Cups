import React, { useState } from 'react';
import { loginUser, signupUser, googleLogin as apiGoogleLogin } from '../api';
import { GoogleLogin } from '@react-oauth/google';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (token: string, user: any) => void;
  initialView?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin, initialView = 'login' }) => {
  const [isLogin, setIsLogin] = useState(initialView === 'login');
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localToast, setLocalToast] = useState<{message: string, type: 'error' | 'success'} | null>(null);
  
  // Validation errors
  const [emailError, setEmailError] = useState('');

  // Google Button Width
  const [googleBtnWidth, setGoogleBtnWidth] = useState<number | undefined>(undefined);
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    const updateWidth = () => {
      if (formRef.current) {
        setGoogleBtnWidth(formRef.current.offsetWidth);
      }
    };
    
    // Initial width
    updateWidth();
    
    // Listen for resize
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [isOpen, isLogin]);

  const resetFormState = (loginMode: boolean) => {
    setIsLogin(loginMode);
    setName('');
    setEmail('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setLocalToast(null);
    setEmailError('');
  };

  React.useEffect(() => {
    if (isOpen) {
      resetFormState(initialView === 'login');
      
      window.history.pushState({ modal: 'auth' }, '');
      const handlePopState = () => {
        onClose();
      };
      
      window.addEventListener('popstate', handlePopState);
      
      return () => {
        window.removeEventListener('popstate', handlePopState);
        if (window.history.state?.modal === 'auth') {
          window.history.back();
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialView]);

  if (!isOpen) return null;

  const showToastMsg = (message: string, type: 'error' | 'success') => {
    setLocalToast({ message, type });
    if (type === 'error') {
      setTimeout(() => {
        setLocalToast((prev) => prev?.message === message ? null : prev);
      }, 4000);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Allow only alphabets and spaces
    if (/^[A-Za-z\s]*$/.test(val)) {
      setName(val);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailError) {
       showToastMsg('Please fix the errors before submitting', 'error');
       return;
    }

    setLocalToast(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        // Login Flow
        const data = await loginUser({ username, password });
        showToastMsg('Login successful!', 'success');
        setTimeout(() => {
          onLogin(data.access_token, data.user);
          onClose();
          setIsLoading(false);
        }, 800);
      } else {
        // Signup Flow
        if (password !== confirmPassword) {
          showToastMsg('Passwords do not match', 'error');
          setIsLoading(false);
          return;
        }
        const data = await signupUser({ name, email, password });
        showToastMsg('Account created successfully!', 'success');
        setTimeout(() => {
          onLogin(data.token, data.user);
          onClose();
          setIsLoading(false);
        }, 800);
      }
    } catch (err: any) {
      showToastMsg(err.message || 'Authentication failed', 'error');
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) return;
    setIsLoading(true);
    setLocalToast(null);
    try {
      console.log('✅ GOOGLE BUTTON LOGIN SUCCESSFUL! Credential received:', credentialResponse);
      const data = await apiGoogleLogin(credentialResponse.credential);
      showToastMsg('Google Login successful!', 'success');
      setTimeout(() => {
        onLogin(data.access_token, data.user);
        onClose();
        setIsLoading(false);
      }, 800);
    } catch (err: any) {
      showToastMsg(err.message || 'Google Authentication failed', 'error');
      setIsLoading(false);
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="fixed inset-x-0 bottom-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-[101] w-full md:max-w-md bg-white rounded-t-[8px] md:rounded-[8px] shadow-2xl animate-slideUp md:animate-fadeIn max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Local Toast */}
        {localToast && (
          <div className={`absolute top-0 left-0 right-0 p-4 text-center text-sm font-bold text-white z-10 transition-all ${
            localToast.type === 'error' ? 'bg-red-500' : 'bg-green-500'
          }`}>
            {localToast.message}
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0 mt-2 md:mt-0">
          <h2 className="text-2xl font-extrabold text-[#1B4D3E]">
            {isLogin ? 'Welcome back' : 'Create Account'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
          >
            <span className="material-symbols-outlined text-[28px]">close</span>
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="p-6 overflow-y-auto no-scrollbar flex-grow">
          <form className="space-y-4" onSubmit={handleSubmit} ref={formRef}>
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={handleNameChange}
                    className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-[8px] shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={handleEmailChange}
                    className={`appearance-none block w-full px-4 py-3 border rounded-[8px] shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent transition-all ${emailError ? 'border-red-500' : 'border-gray-200'}`}
                    placeholder="you@example.com"
                  />
                  {emailError && <p className="text-red-500 text-xs mt-1 font-medium">{emailError}</p>}
                </div>
              </>
            )}

            {isLogin && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-[8px] shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent transition-all"
                  placeholder="Your username"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-[8px] shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent transition-all pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none flex items-center"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`appearance-none block w-full px-4 py-3 border rounded-[8px] shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B4D3E] focus:border-transparent transition-all pr-20 ${
                      confirmPassword.length > 0 
                        ? (password === confirmPassword ? 'border-green-500 focus:ring-green-500' : 'border-red-500 focus:ring-red-500') 
                        : 'border-gray-200'
                    }`}
                    placeholder="••••••••"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {confirmPassword.length > 0 && (
                      <span className={`material-symbols-outlined text-[20px] ${password === confirmPassword ? 'text-green-500' : 'text-red-500'}`}>
                        {password === confirmPassword ? 'check_circle' : 'error'}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none flex items-center"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showConfirmPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !!emailError}
              className={`w-full mt-2 flex justify-center py-4 px-4 border border-transparent rounded-[8px] shadow-sm text-sm font-bold text-white bg-[#1B4D3E] hover:bg-[#123329] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B4D3E] transition-all ${
                isLoading || !!emailError ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
            </button>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 font-medium">Or continue with</span>
              </div>
            </div>

            <div className="flex justify-center w-full">
              {googleBtnWidth && (
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => {
                    showToastMsg('Google Login Failed', 'error');
                  }}
                  shape="rectangular"
                  width={String(Math.min(googleBtnWidth, 400))}
                  logo_alignment="center"
                />
              )}
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600 pb-4">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button"
              onClick={() => resetFormState(!isLogin)}
              className="font-bold text-[#FFB800] hover:text-[#e5a600] transition-colors cursor-pointer"
            >
              {isLogin ? 'Sign up now' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </>
  );
};

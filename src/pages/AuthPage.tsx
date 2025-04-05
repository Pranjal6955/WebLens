import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  college: string;
  course: string;
  graduationYear: string;
}

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SignUpData>({
    email: '',
    password: '',
    fullName: '',
    college: '',
    course: '',
    graduationYear: new Date().getFullYear().toString(),
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signIn, signUp } = useAuthStore();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signIn(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleSignUpStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 1) {
      setCurrentStep(2);
    } else {
      try {
        await signUp(formData.email, formData.password);
        // Here you would typically also save the additional user data to your database
        navigate('/dashboard');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    }
  };

  const updateFormData = (field: keyof SignUpData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg relative">
        <Link to="/" className="absolute top-4 left-4 text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        
        <div className="text-center">
          <div className="flex justify-center">
            <Sparkles className="h-12 w-12 text-indigo-600" />
          </div>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">
            {isSignUp ? 'Join CampusConnect' : 'Welcome back'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isSignUp
              ? 'Create your account in less than a minute'
              : 'Sign in to connect with your campus'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {isSignUp ? (
          <form onSubmit={handleSignUpStep} className="mt-8 space-y-6">
            {currentStep === 1 ? (
              <>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email address
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => updateFormData('password', e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => updateFormData('fullName', e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Continue
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="college" className="block text-sm font-medium text-gray-700">
                      College Name
                    </label>
                    <input
                      id="college"
                      type="text"
                      required
                      value={formData.college}
                      onChange={(e) => updateFormData('college', e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="course" className="block text-sm font-medium text-gray-700">
                      Course/Major
                    </label>
                    <input
                      id="course"
                      type="text"
                      required
                      value={formData.course}
                      onChange={(e) => updateFormData('course', e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700">
                      Graduation Year
                    </label>
                    <select
                      id="graduationYear"
                      value={formData.graduationYear}
                      onChange={(e) => updateFormData('graduationYear', e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                    >
                      {Array.from({ length: 6 }, (_, i) => {
                        const year = new Date().getFullYear() + i;
                        return (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-1/2"
                    onClick={() => setCurrentStep(1)}
                  >
                    Back
                  </Button>
                  <Button type="submit" className="w-1/2">
                    Complete Sign Up
                  </Button>
                </div>
              </>
            )}
          </form>
        ) : (
          <form onSubmit={handleSignIn} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => updateFormData('password', e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>
        )}

        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setCurrentStep(1);
              setError('');
            }}
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            {isSignUp
              ? 'Already have an account? Sign in'
              : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
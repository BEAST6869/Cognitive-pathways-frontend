import { useState, useEffect } from 'react';
import { apiEndpoints } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Loader from '../components/Loader';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        setUser({
          ...userData,
          quizResults: userData.quizResults || null
        });
      }
    }
  };

  const handleAuthError = () => {
    // Clear invalid tokens and force re-login
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    setUser(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const response = await apiEndpoints.login({
          email: formData.email,
          password: formData.password
        });

        const user = response.data.user;
        const { accessToken, refreshToken } = response.data.tokens;

        // Save tokens + user in localStorage
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('userData', JSON.stringify(user));

        setUser({
          ...user,
          quizResults: user.quizResults || null
        });
      } else {
        // Signup
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        await apiEndpoints.register({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });

        alert('Registration successful! Please login.');
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    setUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  if (user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Welcome back, {user.name}!
                </h1>
                <p className="text-gray-600 dark:text-white">
                  Member since {new Date(user.joinedOn).toLocaleDateString()}
                </p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>

          {/* Quiz Results */}
          {user.quizResults ? (
            <Card className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Your Quiz Results
              </h2>
              <div className="bg-gradient-to-r from-primary-500 to-accent-500 text-white p-6 rounded-lg mb-4">
                <h3 className="text-lg font-bold mb-2 text-white">
                  Recommended Stream: {user.quizResults.recommendedStream}
                </h3>
                <p className="text-sm text-white opacity-95">
                  Confidence Score: {user.quizResults.confidence}% • Completed on{' '}
                  {new Date(user.quizResults.completedOn).toLocaleDateString()}
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Top Course Recommendations:
                </h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {user.quizResults.topCourses.map((course, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 dark:bg-white/20 text-primary-800 dark:text-white"
                    >
                      {course}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open('/quiz', '_self')}
                  >
                    Retake Quiz
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open('/courses', '_self')}
                  >
                    Explore Courses
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="mb-8">
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No Quiz Results Yet
                </h3>
                <p className="text-gray-600 dark:text-white mb-4">
                  Take our career assessment quiz to get personalized recommendations.
                </p>
                <Button variant="outline" onClick={() => window.open('/quiz', '_self')}>
                  Take Career Quiz
                </Button>
              </div>
            </Card>
          )}

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card
              title="Explore Courses"
              description="Browse through our comprehensive course catalog and find programs that match your interests."
              onClick={() => window.open('/courses', '_self')}
              className="cursor-pointer hover:shadow-lg transition-shadow"
            >
              <Button variant="outline" size="sm" fullWidth className="mt-4">
                Browse Courses
              </Button>
            </Card>

            <Card
              title="Find Colleges"
              description="Discover top colleges and universities that offer your preferred courses across different locations."
              onClick={() => window.open('/colleges', '_self')}
              className="cursor-pointer hover:shadow-lg transition-shadow"
            >
              <Button variant="outline" size="sm" fullWidth className="mt-4">
                Find Colleges
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isLogin ? 'Welcome Back' : 'Join Us'}
          </h1>
          <p className="text-gray-600 dark:text-white mt-2">
            {isLogin
              ? 'Sign in to access your personalized recommendations'
              : 'Create an account to save your quiz results and preferences'}
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-white rounded">
                {error}
              </div>
            )}

            {!isLogin && (
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-white mb-1"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required={!isLogin}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            )}

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-white mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-white mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {!isLogin && (
              <div className="mb-6">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-white mb-1"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required={!isLogin}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            )}

            <Button
              variant="outline"
              type="submit"
              fullWidth
              disabled={loading}
              className="mb-4"
            >
              {loading ? (
                <>
                  <Loader size="sm" className="mr-2" />
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </>
              ) : isLogin ? (
                'Sign In'
              ) : (
                'Create Account'
              )}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary-600 dark:text-white hover:text-primary-700 dark:hover:text-gray-200 font-medium"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : 'Already have an account? Sign in'}
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Profile;

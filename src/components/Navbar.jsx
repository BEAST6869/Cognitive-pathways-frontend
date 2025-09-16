import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Button from './Button';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/');
  };

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/quiz', label: 'Quiz' },
    { path: '/courses', label: 'Courses' },
    { path: '/colleges', label: 'Colleges' },
    ...(isAuthenticated ? [{ path: '/profile', label: 'Profile' }] : []),
  ];

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-700/20 sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-xl font-bold text-primary-700 dark:text-white">
                Cognitive Pathways
              </h1>
            </Link>
          </div>
          
          <div className="flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'bg-primary-100 dark:bg-white/20 text-primary-700 dark:text-white'
                    : 'text-gray-700 dark:text-white hover:text-primary-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10'
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {isAuthenticated ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/profile')}
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

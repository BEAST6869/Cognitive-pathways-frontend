import { useTheme } from '../contexts/ThemeContext';
import Button from './Button';
import { FiSun, FiMoon } from 'react-icons/fi';

const ThemeToggle = ({ className = '' }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  const handleClick = () => {
    console.log('Theme toggle clicked, current mode:', isDarkMode ? 'dark' : 'light');
    toggleTheme();
  };

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      size="sm"
      title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      className={className}
    >
      <span className="inline-flex items-center gap-2">
        {isDarkMode ? <FiSun className="text-yellow-400" /> : <FiMoon className="text-gray-800 dark:text-white" />}
        {isDarkMode ? 'Light' : 'Dark'}
      </span>
    </Button>
  );
};

export default ThemeToggle;

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'outline',
  size = 'md',
  disabled = false,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transform hover:scale-105 hover:shadow-md';
  
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 disabled:bg-primary-300 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 dark:border-white',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 disabled:bg-gray-100 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 dark:disabled:bg-gray-300',
    accent: 'bg-accent-600 text-white hover:bg-accent-700 focus:ring-accent-500 disabled:bg-accent-300 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100',
    outline: 'border-2 border-primary-600 text-primary-600 hover:border-primary-700 hover:text-primary-700 focus:ring-primary-500 disabled:border-primary-300 disabled:text-primary-300 dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-gray-900 dark:disabled:border-gray-600 dark:disabled:text-gray-600',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300 dark:bg-red-500 dark:hover:bg-red-600',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  };
  
  const widthClasses = fullWidth ? 'w-full' : '';
  
  const disabledClasses = disabled ? 'cursor-not-allowed hover:scale-100 hover:shadow-none' : 'cursor-pointer';
  
  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${widthClasses}
    ${disabledClasses}
    ${className}
  `.trim().replace(/\s+/g, ' ');
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

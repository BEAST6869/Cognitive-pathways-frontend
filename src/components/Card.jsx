const Card = ({ 
  title, 
  subtitle, 
  description, 
  badges = [], 
  onClick, 
  className = '',
  children 
}) => {
  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg dark:shadow-gray-900/20 transition-shadow duration-300 border border-gray-200 dark:border-gray-700 ${className} ${
        onClick ? 'cursor-pointer hover:border-primary-300 dark:hover:border-primary-600' : ''
      }`}
      onClick={onClick}
    >
      <div className="p-6">
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {title}
          </h3>
        )}
        
        {subtitle && (
          <p className="text-sm text-gray-600 dark:text-white mb-3">
            {subtitle}
          </p>
        )}
        
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {badges.map((badge, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-white/20 text-primary-800 dark:text-white"
              >
                {badge}
              </span>
            ))}
          </div>
        )}
        
        {description && (
          <p className="text-gray-700 dark:text-white text-sm leading-relaxed mb-4">
            {description}
          </p>
        )}
        
        {children}
      </div>
    </div>
  );
};

export default Card;

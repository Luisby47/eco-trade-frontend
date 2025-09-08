import React from 'react';

/**
 * Badge component for displaying labels and tags
 */
const Badge = React.forwardRef(({ 
  className = '', 
  variant = 'default',
  children, 
  ...props 
}, ref) => {
  const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';
  
  const variants = {
    default: 'border-transparent bg-green-100 text-green-800',
    outline: 'border border-gray-300 text-gray-700',
    secondary: 'border-transparent bg-gray-100 text-gray-900',
    destructive: 'border-transparent bg-red-100 text-red-800',
  };

  const classes = `${baseClasses} ${variants[variant]} ${className}`;

  return (
    <div ref={ref} className={classes} {...props}>
      {children}
    </div>
  );
});

Badge.displayName = 'Badge';

export { Badge };

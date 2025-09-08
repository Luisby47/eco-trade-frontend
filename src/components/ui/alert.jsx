import React from 'react';

/**
 * Alert component for displaying notifications
 */
const Alert = React.forwardRef(({ 
  className = '', 
  variant = 'default',
  children, 
  ...props 
}, ref) => {
  const baseClasses = 'relative w-full rounded-lg border p-4';
  
  const variants = {
    default: 'border-gray-200 bg-white text-gray-900',
    destructive: 'border-red-200 bg-red-50 text-red-900',
    warning: 'border-yellow-200 bg-yellow-50 text-yellow-900',
    success: 'border-green-200 bg-green-50 text-green-900',
  };

  const classes = `${baseClasses} ${variants[variant]} ${className}`;

  return (
    <div ref={ref} className={classes} {...props}>
      {children}
    </div>
  );
});

Alert.displayName = 'Alert';

const AlertDescription = React.forwardRef(({ 
  className = '', 
  children, 
  ...props 
}, ref) => (
  <div
    ref={ref}
    className={`text-sm [&_p]:leading-relaxed ${className}`}
    {...props}
  >
    {children}
  </div>
));

AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertDescription };

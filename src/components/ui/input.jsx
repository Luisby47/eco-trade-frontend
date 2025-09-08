import React from 'react';

/**
 * Input component for forms
 */
const Input = React.forwardRef(({ 
  className = '', 
  type = 'text',
  error = false,
  ...props 
}, ref) => {
  const baseClasses = 'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50';
  const errorClasses = error ? 'border-red-500 focus:ring-red-500' : '';

  return (
    <input
      type={type}
      className={`${baseClasses} ${errorClasses} ${className}`}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export { Input };

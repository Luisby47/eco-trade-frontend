import React from 'react';

/**
 * Textarea component for longer text input
 */
const Textarea = React.forwardRef(({ 
  className = '', 
  error = false,
  ...props 
}, ref) => {
  const baseClasses = 'flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50';
  const errorClasses = error ? 'border-red-500 focus:ring-red-500' : '';

  return (
    <textarea
      className={`${baseClasses} ${errorClasses} ${className}`}
      ref={ref}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';

export { Textarea };

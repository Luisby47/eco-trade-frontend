import React from 'react';

/**
 * Select component for dropdowns
 */
const Select = React.forwardRef(({ 
  className = '', 
  children,
  ...props 
}, ref) => {
  const classes = `flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`;

  return (
    <select ref={ref} className={classes} {...props}>
      {children}
    </select>
  );
});

Select.displayName = 'Select';

const SelectTrigger = React.forwardRef(({ 
  className = '', 
  children,
  ...props 
}, ref) => (
  <div ref={ref} className={className} {...props}>
    {children}
  </div>
));

SelectTrigger.displayName = 'SelectTrigger';

const SelectContent = React.forwardRef(({ 
  className = '', 
  children,
  ...props 
}, ref) => (
  <div ref={ref} className={className} {...props}>
    {children}
  </div>
));

SelectContent.displayName = 'SelectContent';

const SelectItem = React.forwardRef(({ 
  className = '', 
  children,
  ...props 
}, ref) => (
  <option ref={ref} className={className} {...props}>
    {children}
  </option>
));

SelectItem.displayName = 'SelectItem';

const SelectValue = React.forwardRef(({ 
  className = '', 
  placeholder,
  ...props 
}, ref) => (
  <span ref={ref} className={className} {...props}>
    {placeholder}
  </span>
));

SelectValue.displayName = 'SelectValue';

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue };

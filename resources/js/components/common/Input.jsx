import React from 'react';
import clsx from 'clsx';

const Input = React.forwardRef(({
  label,
  type = 'text',
  error,
  helperText,
  required = false,
  disabled = false,
  className,
  ...props
}, ref) => {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        ref={ref}
        type={type}
        disabled={disabled}
        className={clsx(
          'form-input',
          error && 'border-danger-500 focus:ring-danger-500 focus:border-danger-500',
          disabled && 'bg-gray-100 cursor-not-allowed',
          className
        )}
        {...props}
      />
      
      {error && <p className="form-error">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-gray-500 mt-1">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
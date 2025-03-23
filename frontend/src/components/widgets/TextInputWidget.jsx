import PropTypes from 'prop-types';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { cn } from '@/lib/utils';

const TextInputWidget = ({
  label,
  placeholder,
  value = '',
  id = 'text-input',
  onChange,
  className,
  error,
  disabled = false,
  required = false,
  type = 'text',
  size = 'default', // "sm", "default", "lg"
  variant = 'default', // "default", "ghost"
}) => {
  const handleChange = (e) => {
    const newValue = e.target.value;
    // Using only allowed console methods
    console.error('[TextInputWidget] Change event:', {
      id,
      oldValue: value,
      newValue: newValue,
      timestamp: new Date().toISOString(),
    });

    try {
      onChange?.(newValue);
      console.error('[TextInputWidget] State updated successfully:', {
        id,
        value: newValue,
      });
    } catch (error) {
      console.error('[TextInputWidget] Error updating state:', {
        id,
        error: error.message,
      });
    }
  };

  // Size variants
  const sizeVariants = {
    sm: 'h-8 text-xs',
    default: 'h-10 text-sm',
    lg: 'h-12 text-base',
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label
          htmlFor={id}
          className={cn(
            'text-sm font-medium',
            error && 'text-destructive',
            disabled && 'opacity-50'
          )}
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <Input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          sizeVariants[size],
          variant === 'ghost' && 'border-none shadow-none',
          error && 'border-destructive focus-visible:ring-destructive'
        )}
        aria-invalid={error ? 'true' : undefined}
        required={required}
      />
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
};

TextInputWidget.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  id: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  type: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'default', 'lg']),
  variant: PropTypes.oneOf(['default', 'ghost']),
};

export default TextInputWidget;

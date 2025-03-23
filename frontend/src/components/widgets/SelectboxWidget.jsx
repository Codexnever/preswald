'use client';

import PropTypes from 'prop-types';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

const SelectboxWidget = ({
  label,
  options = [],
  value,
  id,
  onChange,
  className,
  placeholder = 'Select an option',
  disabled = false,
  error,
  required = false,
  size = 'default', // "sm", "default", "lg"
}) => {
  const handleValueChange = (newValue) => {
    console.error('[SelectboxWidget] Change event:', {
      id,
      oldValue: value,
      newValue: newValue,
      timestamp: new Date().toISOString(),
    });

    try {
      onChange?.(newValue);
      console.error('[SelectboxWidget] State updated successfully:', {
        id,
        value: newValue,
      });
    } catch (err) {
      console.error('[SelectboxWidget] Error updating state:', {
        id,
        error: err.message,
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
      <Select value={value} onValueChange={handleValueChange} disabled={disabled}>
        <SelectTrigger
          id={id}
          className={cn(sizeVariants[size], error && 'border-destructive focus:ring-destructive')}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="min-w-[var(--radix-select-trigger-width)]">
          {options.map((option, index) => (
            <SelectItem
              key={index}
              value={option}
              className={cn(
                'cursor-pointer w-full data-[highlighted]:bg-muted data-[highlighted]:text-foreground px-4',
                size === 'sm' && 'text-xs py-1.5',
                size === 'lg' && 'text-base py-2.5'
              )}
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
};

SelectboxWidget.propTypes = {
  label: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.string),
  value: PropTypes.string,
  id: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  required: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'default', 'lg']),
};

export default SelectboxWidget;
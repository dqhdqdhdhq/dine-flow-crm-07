
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SegmentedControlProps<T extends string> {
  options: { label: string; value: T }[];
  value: T;
  onValueChange: (value: T) => void;
  className?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onValueChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div className={cn("flex w-full items-center justify-center", className)}>
      <div className="flex space-x-1 rounded-lg bg-muted p-1">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onValueChange(option.value)}
            className={cn(
              'relative w-full rounded-md px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              { 'text-foreground': value === option.value }
            )}
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            {value === option.value && (
              <motion.div
                layoutId="segmented-control-active-pill"
                className="absolute inset-0 rounded-lg bg-background shadow-sm"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

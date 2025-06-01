
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TruncatedButtonProps {
  children: React.ReactNode;
  tooltip?: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  onClick?: () => void;
  disabled?: boolean;
}

export const TruncatedButton: React.FC<TruncatedButtonProps> = ({
  children,
  tooltip,
  className = '',
  variant = "outline",
  size = "default",
  onClick,
  disabled = false
}) => {
  if (!tooltip) {
    return (
      <Button
        variant={variant}
        size={size}
        className={`overflow-hidden ${className}`}
        onClick={onClick}
        disabled={disabled}
      >
        <div className="truncate w-full">
          {children}
        </div>
      </Button>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size}
            className={`overflow-hidden ${className}`}
            onClick={onClick}
            disabled={disabled}
          >
            <div className="truncate w-full">
              {children}
            </div>
          </Button>
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          className="max-w-xs break-words z-50 bg-popover border shadow-md"
        >
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

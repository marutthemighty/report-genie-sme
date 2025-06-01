
import React, { useState, useRef, useEffect } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TruncatedTextProps {
  text: string;
  className?: string;
  maxLines?: number;
}

export const TruncatedText: React.FC<TruncatedTextProps> = ({ 
  text, 
  className = '', 
  maxLines = 1 
}) => {
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = textRef.current;
    if (element) {
      const lineHeight = parseInt(window.getComputedStyle(element).lineHeight);
      const maxHeight = lineHeight * maxLines;
      setIsTruncated(element.scrollHeight > maxHeight);
    }
  }, [text, maxLines]);

  const truncateClass = maxLines === 1 
    ? 'truncate' 
    : `line-clamp-${maxLines}`;

  if (!isTruncated) {
    return (
      <div 
        ref={textRef}
        className={`${truncateClass} ${className}`}
      >
        {text}
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            ref={textRef}
            className={`${truncateClass} cursor-help ${className}`}
          >
            {text}
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          className="max-w-xs break-words z-50 bg-popover border shadow-md"
        >
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

import * as React from "react";
import { cn } from "cn";

/**
 * 7K LED CRM – Central Textarea Design Tokens
 * Edycja poniższych klas zmienia wygląd WSZYSTKICH pól textarea w całym CRM.
 */
export const TEXTAREA_BASE_STYLES =
  "w-full min-w-0 rounded-xl border border-slate-800 bg-[#0d121c] p-3.5 text-xs text-white placeholder:text-slate-500 transition-colors outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 disabled:pointer-events-none disabled:opacity-50 resize-none";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        data-slot="textarea"
        className={cn(TEXTAREA_BASE_STYLES, className)}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

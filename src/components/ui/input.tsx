import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "cn";

/**
 * 7K LED CRM – Central Input Design Tokens
 * Edycja poniższych klas zmienia wygląd WSZYSTKICH pól input w całym CRM.
 */
export const INPUT_BASE_STYLES =
  "w-full min-w-0 rounded-xl border border-slate-800 bg-[#0d121c] px-3.5 py-2 text-xs text-white placeholder:text-slate-500 transition-colors outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 disabled:pointer-events-none disabled:opacity-50";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(INPUT_BASE_STYLES, className)}
      {...props}
    />
  );
}

export { Input };

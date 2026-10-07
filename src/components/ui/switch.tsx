"use client";

import * as React from "react";
import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { cn } from "@/lib/utils";

/**
 * 7K LED CRM – Modern Switch Toggle Primitive
 * Styl: Dark Graphite & Electric Tech Blue (Linear / Stripe / Raycast standard)
 */
function Switch({
  className,
  checked,
  onCheckedChange,
  ...props
}: SwitchPrimitive.Root.Props) {
  return (
    <SwitchPrimitive.Root
      checked={checked}
      onCheckedChange={onCheckedChange}
      data-slot="switch"
      className={cn(
        "group relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-slate-700/60 transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-50",
        "bg-slate-800 data-[checked]:bg-blue-600 data-[checked]:border-blue-500 data-[checked]:shadow-sm data-[checked]:shadow-blue-500/30",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block size-3.5 rounded-full bg-slate-300 shadow-sm transition-transform duration-200 ease-in-out",
          "translate-x-0.5 data-[checked]:translate-x-4.5 data-[checked]:bg-white"
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };

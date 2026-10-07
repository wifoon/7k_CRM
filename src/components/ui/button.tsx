import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

/**
 * 7K LED CRM – Central Button Design Tokens
 * Edycja poniższych klas zmienia wygląd WSZYSTKICH przycisków w całym CRM.
 */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-xl border text-xs font-semibold whitespace-nowrap transition-all outline-none select-none cursor-pointer disabled:pointer-events-none disabled:opacity-50 active:translate-y-px [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Główny akcent CRM: Electric Tech Blue
        default:
          "bg-blue-600 hover:bg-blue-500 text-white border-transparent shadow-md shadow-blue-600/25",
        // Drugorzędny grafit
        secondary:
          "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700/60 shadow-sm",
        // Obramowany ciemny
        outline:
          "border-slate-800 bg-[#0d121c] hover:bg-slate-800/80 text-slate-300 hover:text-white shadow-sm",
        // Dyskretny / przezroczysty
        ghost:
          "border-transparent hover:bg-slate-800/60 text-slate-400 hover:text-white",
        // Akcja niebezpieczna (usuwanie)
        destructive:
          "bg-rose-600 hover:bg-rose-500 text-white border-transparent shadow-md shadow-rose-600/25",
        // Link tekstowy
        link:
          "border-transparent text-blue-400 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 gap-2",
        xs: "h-6 px-2 text-[11px] gap-1 rounded-md",
        sm: "h-7.5 px-3 text-xs gap-1.5 rounded-lg",
        lg: "h-11 px-6 text-sm gap-2",
        icon: "h-9 w-9 p-0",
        "icon-sm": "h-7.5 w-7.5 p-0 rounded-lg",
        "icon-xs": "h-6 w-6 p-0 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

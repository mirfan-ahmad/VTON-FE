"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    ref={ref}
    {...props}
    className={cn(
      "shadow-xl peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors",
      "border-2 border-gray-300 bg-gray-200", // OFF state (background and border)
      "data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600", // ON state
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        " pointer-events-none block h-5 w-5 rounded-full bg-white shadow-md transform transition-transform duration-300",
        "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
))

Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }

"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import { Label as LabelPrimitive } from "@radix-ui/react-label"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive>
>(({ className, ...props }, ref) => (
  <LabelPrimitive ref={ref} className={className} {...props} />
))

Label.displayName = "Label"

export { Label }

import * as React from "react"
import { cn } from "@/lib/utils"

type SelectProps = {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
}

const Select = ({ value, onValueChange, children }: SelectProps) => {
  const extractOptions = (node: React.ReactNode): React.ReactNode[] => {
    const result: React.ReactNode[] = []
    React.Children.forEach(node, (child) => {
      if (React.isValidElement(child)) {
        if (child.type === SelectItem || (child.type as any)?.displayName === "SelectItem") {
          result.push(child)
        } else if (child.props?.children) {
          result.push(...extractOptions(child.props.children))
        }
      }
    })
    return result
  }

  const options = extractOptions(children)

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
      >
        {options}
      </select>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  )
}

const SelectTrigger = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn(className)} {...props}>
    {children}
  </div>
)

const SelectValue = ({ className, placeholder, children, ...props }: React.HTMLAttributes<HTMLSpanElement> & { placeholder?: string }) => (
  <span className={cn("block truncate", className)} {...props}>
    {children || placeholder}
  </span>
)

const SelectContent = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn(className)} {...props}>
    {children}
  </div>
)

const SelectItem = ({ className, children, ...props }: React.OptionHTMLAttributes<HTMLOptionElement>) => (
  <option className={cn(className)} {...props}>
    {children}
  </option>
)

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }

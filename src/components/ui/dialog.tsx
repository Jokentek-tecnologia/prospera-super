import * as React from 'react'
import { cn } from '@/lib/utils'

type DialogContextType = { open: boolean; setOpen: (v: boolean) => void }
const DialogContext = React.createContext<DialogContextType | null>(null)

export function Dialog({ open: controlledOpen, onOpenChange, children }: { open?: boolean; onOpenChange?: (v: boolean) => void; children: React.ReactNode }) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = (v: boolean) => {
    if (controlledOpen === undefined) setUncontrolledOpen(v)
    onOpenChange?.(v)
  }
  return <DialogContext.Provider value={{ open, setOpen }}>{children}</DialogContext.Provider>
}

export function DialogTrigger({ asChild, children }: { asChild?: boolean; children: React.ReactElement }) {
  const ctx = React.useContext(DialogContext)!
  const props = {
    onClick: (e: any) => {
      children.props?.onClick?.(e)
      ctx.setOpen(true)
    },
  }
  return asChild ? React.cloneElement(children, props) : <button {...props}>{children}</button>
}

export function DialogContent({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  const ctx = React.useContext(DialogContext)!
  if (!ctx.open) return null
  return (
    <div className="fixed inset-0 z-50 grid place-items-center">
      <div className="absolute inset-0 bg-black/40" onClick={() => ctx.setOpen(false)} />
      <div className={cn('relative z-10 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl', className)}>{children}</div>
    </div>
  )
}

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-4', className)} {...props} />
}
export function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn('text-lg font-semibold', className)} {...props} />
}

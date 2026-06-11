import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: ButtonVariant
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-rose-100 text-[#3f0d1f] shadow-[0_16px_40px_rgba(248,185,205,0.28)] hover:bg-white',
  secondary:
    'border border-rose-200/50 bg-white/10 text-rose-50 hover:bg-white/16',
  danger:
    'border border-red-300/45 bg-red-500/16 text-red-50 hover:bg-red-500/24',
  ghost: 'text-rose-50/80 hover:bg-white/10 hover:text-white',
}

export function Button({
  children,
  className = '',
  variant = 'primary',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-12 items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose-100 disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

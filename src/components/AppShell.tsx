import type { ReactNode } from 'react'

type AppShellProps = {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-svh overflow-hidden bg-[#16070d] text-rose-50">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(248,185,205,0.18),transparent_28rem),radial-gradient(circle_at_90%_12%,rgba(122,25,55,0.34),transparent_30rem),linear-gradient(145deg,#16070d_0%,#3f0d1f_48%,#0c0508_100%)]" />
      <div className="pointer-events-none fixed inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,0.55)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.55)_1px,transparent_1px)] [background-size:34px_34px]" />
      <main className="relative mx-auto flex min-h-svh w-full max-w-6xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}

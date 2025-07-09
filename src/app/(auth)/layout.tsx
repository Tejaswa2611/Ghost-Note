export const metadata = {
  title: 'Authentication - GhostNote',
  description: 'Sign in or create your account to start receiving anonymous messages on GhostNote.',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // Simple wrapper that doesn't interfere with the navbar from root layout
    <main className="auth-layout">
      {children}
    </main>
  )
}

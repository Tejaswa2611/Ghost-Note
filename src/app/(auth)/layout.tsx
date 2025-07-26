export const metadata = {
  title: 'Authentication - FeedForward',
  description: 'Sign in or create your account to start collecting anonymous feedback with FeedForward.',
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

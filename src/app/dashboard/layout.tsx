// Remove NavBar from here!
// Only keep this file if you want unique dashboard layout, like sidebar, etc.

export const metadata = {
  title: 'Dashboard - GhostNote',
  description: 'Manage your anonymous messages and account settings.',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
        </>
    );
}

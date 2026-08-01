import { Navbar } from './Navbar';
import { Sidebar, SidebarLink } from './Sidebar';

export function DashboardShell({ links, children }: { links: SidebarLink[]; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="mx-auto flex max-w-6xl">
        <Sidebar links={links} />
        <main className="min-w-0 flex-1 px-4 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}

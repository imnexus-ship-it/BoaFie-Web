import { DashboardTopbar } from './DashboardTopbar';
import { Sidebar, SidebarLink } from './Sidebar';

export function DashboardShell({
  links,
  messagesHref,
  sidebarBottomSlot,
  children,
}: {
  links: SidebarLink[];
  messagesHref?: string;
  sidebarBottomSlot?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar links={links} bottomSlot={sidebarBottomSlot} />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopbar messagesHref={messagesHref} />
        <main className="min-w-0 flex-1 px-4 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}

import { SyncStatus } from "./SyncStatus";

interface MainLayoutProps {
  children: React.ReactNode;
  showSyncStatus?: boolean;
}

export function MainLayout({
  children,
  showSyncStatus = true,
}: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {showSyncStatus && (
        <div className="fixed top-4 right-4 z-50">
          <SyncStatus />
        </div>
      )}
      {children}
    </div>
  );
}

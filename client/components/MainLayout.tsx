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
    <div className="min-h-screen bg-background mobile-app safe-area-top safe-area-bottom">
      {showSyncStatus && (
        <div className="fixed top-4 right-4 z-50 safe-area-top safe-area-right">
          <SyncStatus />
        </div>
      )}
      <div className="mobile-scroll h-full overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

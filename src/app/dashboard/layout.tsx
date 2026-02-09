import DashboardSidebar from '@/components/layout/DashboardSidebar';
import DashboardTopbar from '@/components/layout/DashboardTopbar';
import TrialExpiredWrapper from '@/components/TrialExpiredWrapper';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar />
      <DashboardTopbar />
      <main className="lg:ml-64 pt-0">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
      {/* Trial expired modal - shows on all dashboard pages except billing */}
      <TrialExpiredWrapper />
    </div>
  );
}

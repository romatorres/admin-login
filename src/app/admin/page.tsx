import { DashboardStats } from "./_components/dashboard-stats";
import { RecentActivity } from "./_components/recent-activity";
import { QuickActions } from "./_components/quick-actions";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Bem-vindo ao painel de controle</p>
      </div>

      <DashboardStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <QuickActions />
      </div>
    </div>
  );
}

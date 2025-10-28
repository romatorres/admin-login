import { Users, FileText, BarChart3, TrendingUp } from "lucide-react";

const stats = [
  {
    name: "Total de Usuários",
    value: "1,234",
    change: "+12%",
    changeType: "increase",
    icon: Users,
  },
  {
    name: "Documentos",
    value: "856",
    change: "+5%",
    changeType: "increase",
    icon: FileText,
  },
  {
    name: "Relatórios",
    value: "42",
    change: "+8%",
    changeType: "increase",
    icon: BarChart3,
  },
  {
    name: "Crescimento",
    value: "23.5%",
    change: "+2.1%",
    changeType: "increase",
    icon: TrendingUp,
  },
];

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <stat.icon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm font-medium text-green-600">
              {stat.change}
            </span>
            <span className="text-sm text-gray-500 ml-2">vs mês anterior</span>
          </div>
        </div>
      ))}
    </div>
  );
}
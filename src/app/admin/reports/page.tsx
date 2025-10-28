import { Button } from "@/components/ui/button";
import { Download, Calendar, BarChart3, TrendingUp, Users, FileText } from "lucide-react";

const reports = [
  {
    id: 1,
    name: "Relatório de Usuários",
    description: "Estatísticas detalhadas sobre usuários ativos",
    type: "Mensal",
    lastGenerated: "2024-01-15",
    icon: Users,
  },
  {
    id: 2,
    name: "Relatório de Atividades",
    description: "Resumo das atividades do sistema",
    type: "Semanal",
    lastGenerated: "2024-01-14",
    icon: BarChart3,
  },
  {
    id: 3,
    name: "Relatório de Crescimento",
    description: "Análise de crescimento e tendências",
    type: "Trimestral",
    lastGenerated: "2024-01-01",
    icon: TrendingUp,
  },
  {
    id: 4,
    name: "Relatório de Documentos",
    description: "Estatísticas sobre documentos e uploads",
    type: "Mensal",
    lastGenerated: "2024-01-15",
    icon: FileText,
  },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-600">Visualize e baixe relatórios do sistema</p>
        </div>
        <Button>
          <Calendar className="h-4 w-4 mr-2" />
          Agendar Relatório
        </Button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Relatórios Gerados</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Este Mês</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
            <Calendar className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Agendados</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Reports grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <report.icon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {report.name}
                  </h3>
                  <p className="text-sm text-gray-600">{report.description}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                <span className="font-medium">{report.type}</span> • 
                Último: {report.lastGenerated}
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Visualizar
                </Button>
                <Button size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Baixar
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
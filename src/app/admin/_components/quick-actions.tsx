import { Button } from "@/components/ui/button";
import { Plus, Upload, Download, Settings } from "lucide-react";

const actions = [
  {
    name: "Novo Usuário",
    description: "Adicionar um novo usuário ao sistema",
    icon: Plus,
    href: "/admin/users/new",
  },
  {
    name: "Upload Arquivo",
    description: "Fazer upload de documentos",
    icon: Upload,
    href: "/admin/documents/upload",
  },
  {
    name: "Exportar Dados",
    description: "Baixar relatórios e dados",
    icon: Download,
    href: "/admin/reports/export",
  },
  {
    name: "Configurações",
    description: "Gerenciar configurações do sistema",
    icon: Settings,
    href: "/admin/settings",
  },
];

export function QuickActions() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Ações Rápidas
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action) => (
          <Button
            key={action.name}
            variant="outline"
            className="h-auto p-4 flex flex-col items-start space-y-2 hover:bg-gray-50"
            asChild
          >
            <a href={action.href}>
              <div className="flex items-center space-x-2">
                <action.icon className="h-5 w-5 text-blue-600" />
                <span className="font-medium">{action.name}</span>
              </div>
              <p className="text-xs text-gray-500 text-left">
                {action.description}
              </p>
            </a>
          </Button>
        ))}
      </div>
    </div>
  );
}
import { Button } from "@/components/ui/button";
import { Save, Shield, Bell, Palette, Database, Mail } from "lucide-react";

const settingSections = [
  {
    id: "general",
    name: "Configurações Gerais",
    description: "Configurações básicas do sistema",
    icon: Shield,
  },
  {
    id: "notifications",
    name: "Notificações",
    description: "Gerencie notificações e alertas",
    icon: Bell,
  },
  {
    id: "appearance",
    name: "Aparência",
    description: "Personalize a interface do sistema",
    icon: Palette,
  },
  {
    id: "database",
    name: "Banco de Dados",
    description: "Configurações de conexão e backup",
    icon: Database,
  },
  {
    id: "email",
    name: "E-mail",
    description: "Configurações de servidor de e-mail",
    icon: Mail,
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600">Gerencie as configurações do sistema</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Seções</h3>
            </div>
            <nav className="p-2">
              {settingSections.map((section) => (
                <button
                  key={section.id}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-left rounded-md hover:bg-gray-50 transition-colors"
                >
                  <section.icon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {section.name}
                    </p>
                    <p className="text-xs text-gray-500">{section.description}</p>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Configurações Gerais
              </h3>
              <p className="text-sm text-gray-600">
                Configure as opções básicas do sistema
              </p>
            </div>
            <div className="p-6 space-y-6">
              {/* Site name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Site
                </label>
                <input
                  type="text"
                  defaultValue="Admin Panel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Site description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  rows={3}
                  defaultValue="Painel de controle administrativo"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Timezone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fuso Horário
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="America/Sao_Paulo">
                    (UTC-03:00) São Paulo
                  </option>
                  <option value="America/New_York">
                    (UTC-05:00) New York
                  </option>
                  <option value="Europe/London">(UTC+00:00) London</option>
                </select>
              </div>

              {/* Language */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Idioma
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en-US">English (US)</option>
                  <option value="es-ES">Español</option>
                </select>
              </div>

              {/* Maintenance mode */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    Modo de Manutenção
                  </h4>
                  <p className="text-sm text-gray-500">
                    Ativar modo de manutenção para o site
                  </p>
                </div>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                </button>
              </div>

              {/* Save button */}
              <div className="flex justify-end pt-4 border-t border-gray-200">
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Configurações
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
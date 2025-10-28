const activities = [
  {
    id: 1,
    user: "João Silva",
    action: "criou um novo documento",
    time: "2 minutos atrás",
    avatar: "JS",
  },
  {
    id: 2,
    user: "Maria Santos",
    action: "atualizou configurações",
    time: "15 minutos atrás",
    avatar: "MS",
  },
  {
    id: 3,
    user: "Pedro Costa",
    action: "gerou relatório mensal",
    time: "1 hora atrás",
    avatar: "PC",
  },
  {
    id: 4,
    user: "Ana Oliveira",
    action: "adicionou novo usuário",
    time: "2 horas atrás",
    avatar: "AO",
  },
];

export function RecentActivity() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Atividade Recente
      </h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">
                {activity.avatar}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">
                <span className="font-medium">{activity.user}</span>{" "}
                {activity.action}
              </p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          Ver todas as atividades →
        </button>
      </div>
    </div>
  );
}
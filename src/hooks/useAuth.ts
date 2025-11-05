import { authClient } from "@/lib/auth-client";
import { type UserRole } from "@/lib/types";

export function useAuth() {
  const { data: session, isPending, refetch } = authClient.useSession();

  const user = session?.user;
  const userRole = ((user as { role?: string })?.role as UserRole) || "USER";

  return {
    // Dados do usuário
    user,
    session,
    isLoading: isPending,
    isAuthenticated: !!session,

    // Role e permissões
    role: userRole,
    isAdmin: userRole === "ADMIN",
    isManager: userRole === "MANAGER",
    canManageContent: userRole === "ADMIN" || userRole === "MANAGER",

    // Funções de verificação de permissão (simplificadas)
    hasPermission: (permission: string) => {
      // Para ADMIN, sempre tem permissão
      if (userRole === "ADMIN") return true;

      // Para MANAGER, permissões de conteúdo
      if (userRole === "MANAGER") {
        const managerPermissions = [
          "agenda:read",
          "agenda:create",
          "agenda:update",
          "agenda:delete",
          "profile:read_own",
          "profile:update_own",
        ];
        return managerPermissions.includes(permission);
      }

      // Para USER, apenas permissões básicas
      const userPermissions = [
        "agenda:read",
        "profile:read_own",
        "profile:update_own",
      ];

      return userPermissions.includes(permission);
    },

    // Funções de autenticação
    signIn: authClient.signIn.email,
    signOut: authClient.signOut,
    signUp: authClient.signUp.email,
    refetchSession: refetch,
  };
}

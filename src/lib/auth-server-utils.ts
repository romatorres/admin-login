import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { type UserRole } from "@/lib/types";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export async function getAuthUser(): Promise<AuthUser | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return null;
    }

    return {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: (session.user.role as UserRole) || "USER",
    };
  } catch (error) {
    console.error("Error getting auth user:", error);
    return null;
  }
}

export async function requireAdmin() {
  const user = await getAuthUser();
  if (user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireAuth() {
  const user = await getAuthUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireManagerOrAdmin() {
  const user = await getAuthUser();
  if (user?.role !== "ADMIN" && user?.role !== "MANAGER") {
    throw new Error("Unauthorized");
  }
  return user;
}

// Re-export das funções utilitárias para compatibilidade
export { isAdmin, canManageUsers, canManageContent } from "@/lib/auth-utils";

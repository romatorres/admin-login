// Funções utilitárias que podem ser usadas no cliente
import { type UserRole } from "@/lib/types";

export function isAdmin(role: UserRole): boolean {
  return role === "ADMIN";
}

export function isManager(role: UserRole): boolean {
  return role === "MANAGER";
}

export function canManageUsers(role: UserRole): boolean {
  return role === "ADMIN";
}

export function canManageContent(role: UserRole): boolean {
  return role === "ADMIN" || role === "MANAGER";
}

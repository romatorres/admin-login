import type { UserRole as PrismaUserRole } from "@prisma/client";

/**
 * Representa as roles de usuário disponíveis no sistema,
 * importadas diretamente do schema do Prisma para garantir consistência.
 */
export type UserRole = PrismaUserRole;

/**
 * Array com os valores do enum UserRole.
 * Útil para validação com Zod ou para gerar opções em um select.
 */
export const userRoles = ["ADMIN", "MANAGER", "USER"] as const;

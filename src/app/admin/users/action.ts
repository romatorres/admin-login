"use server";

import { auth } from "@/lib/auth";
import { requireAdmin, requireAuth } from "@/lib/auth-server-utils";
import { type UserRole } from "@/lib/types";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Listar todos os usuários (Admin)
export async function listUsers() {
  await requireAdmin();

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return users;
}

// Obter perfil de usuário (Admin)
export async function getUserProfile(userId: string) {
  await requireAdmin();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  return user;
}

// Criar usuário (apenas Admin)
export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}) {
  await requireAdmin();

  try {
    const result = await auth.api.signUpEmail({
      body: {
        email: data.email,
        password: data.password,
        name: data.name,
      },
    });

    // Atualizar o role se fornecido
    if (data.role && result.user) {
      await prisma.user.update({
        where: { id: result.user.id },
        data: { role: data.role },
      });
    }

    revalidatePath("/admin/users");
    return result;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro ao criar usuário";
    throw new Error(errorMessage);
  }
}

// Atualizar usuário (Admin)
export async function updateUser(
  userId: string,
  data: {
    name?: string;
    email?: string;
    role?: UserRole;
  }
) {
  await requireAdmin();

  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  revalidatePath("/admin/users");
  revalidatePath("/profile");

  return user;
}

// Atualizar role do usuário (apenas Admin)
export async function updateUserRole(userId: string, role: UserRole) {
  const currentUser = await requireAdmin();

  // Não pode alterar o próprio role
  if (currentUser.id === userId) {
    throw new Error("Você não pode alterar seu próprio role");
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { role },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  revalidatePath("/admin/users");
  return user;
}

// Deletar usuário (apenas Admin)
export async function deleteUser(userId: string) {
  const session = await requireAdmin();

  // Não pode deletar a si mesmo
  if (session.id === userId) {
    throw new Error("Você não pode deletar sua própria conta");
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  revalidatePath("/admin/users");
  return { success: true };
}

// Atualizar o próprio perfil (usuário logado)
export async function updateMyProfile(data: {
  name?: string;
  email?: string;
}) {
  const user = await requireAuth();

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  revalidatePath("/admin/profile");

  return updatedUser;
}

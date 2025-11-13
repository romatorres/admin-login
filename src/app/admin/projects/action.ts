"use server";

import { requireAuth, requireManagerOrAdmin } from "@/lib/auth-server-utils";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function listProjects() {
  await requireAuth();

  const projects = await prisma.project.findMany({
    orderBy: {
      title: "asc",
    },
  });

  return projects;
}

export async function getProject(id: string) {
  await requireAuth();

  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) {
    throw new Error("Projeto não encontrada");
  }

  return project;
}

export async function createProject(data: {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  order?: number;
  isActive?: boolean;
}) {
  await requireManagerOrAdmin();

  const project = await prisma.project.create({
    data: {
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
      link: data.link,
      order: data.order,
      isActive: data.isActive ?? true,
    },
  });

  revalidatePath("/admin/projects");
  revalidatePath("/");
  return project;
}

export async function updateProject(
  id: string,
  data: {
    title?: string;
    description?: string;
    imageUrl?: string;
    link?: string;
    order?: number;
    isActive?: boolean;
  }
) {
  await requireManagerOrAdmin();

  const project = await prisma.project.update({
    where: { id },
    data,
  });

  revalidatePath("/admin/projects");
  revalidatePath("/");
  return project;
}

export async function deleteProject(id: string) {
  await requireManagerOrAdmin();

  await prisma.project.delete({
    where: { id },
  });

  revalidatePath("/admin/projects");
  revalidatePath("/");
  return { success: true };
}

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const project = await prisma.project.findUnique({
      where: { id: id },
    });
    return NextResponse.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { message: "Erro ao buscar um projeto." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { title, description, imageUrl, link, order, isActive } =
      await request.json();
    const projectUpdateData: {
      title?: string;
      description?: string;
      imageUrl?: string;
      link?: string;
      order?: number;
      isActive?: boolean;
    } = {};

    if (title !== undefined) projectUpdateData.title = title;
    if (description !== undefined) projectUpdateData.description = description;
    if (imageUrl !== undefined) projectUpdateData.imageUrl = imageUrl;
    if (link !== undefined) projectUpdateData.link = link;
    if (order !== undefined) projectUpdateData.order = order;
    if (isActive !== undefined) projectUpdateData.isActive = isActive;

    if (Object.keys(projectUpdateData).length > 0) {
      await prisma.project.update({
        where: { id: id },
        data: projectUpdateData,
      });
    }

    const updatedProject = await prisma.project.findUnique({
      where: { id: id },
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("Error editing project:", error);
    return NextResponse.json(
      { message: "Erro ao editar um projeto." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await prisma.project.delete({
      where: { id: id },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { message: "Erro ao excluir um projeto." },
      { status: 500 }
    );
  }
}

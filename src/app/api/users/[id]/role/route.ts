import { NextResponse } from "next/server";
import { updateUserRole } from "@/app/admin/users/action";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { role } = body;

    if (!role) {
      return NextResponse.json(
        { message: "Role é obrigatório." },
        { status: 400 }
      );
    }

    const resolvedParams = await params;
    const user = await updateUserRole(resolvedParams.id, role);
    return NextResponse.json(user);
  } catch (error: unknown) {
    console.error("Error updating user role:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Erro ao atualizar role do usuário.";
    return NextResponse.json(
      { message: errorMessage },
      { status: errorMessage.includes("Apenas administradores") ? 403 : 500 }
    );
  }
}

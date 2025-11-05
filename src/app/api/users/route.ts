import { NextResponse } from "next/server";
import { createUser, listUsers } from "@/app/admin/users/action";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Todos os campos obrigatórios devem ser preenchidos." },
        { status: 400 }
      );
    }

    const user = await createUser({ name, email, password, role });
    return NextResponse.json(user, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating user:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erro ao criar usuário.";
    return NextResponse.json(
      { message: errorMessage },
      { status: errorMessage.includes("Apenas administradores") ? 403 : 500 }
    );
  }
}

export async function GET() {
  try {
    const users = await listUsers();
    return NextResponse.json(users);
  } catch (error: unknown) {
    console.error("Error fetching users:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erro ao buscar usuários.";
    return NextResponse.json(
      { message: errorMessage },
      { status: errorMessage.includes("Apenas administradores") ? 403 : 500 }
    );
  }
}

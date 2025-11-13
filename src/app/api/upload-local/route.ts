import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { mkdirSync, existsSync } from "fs";

// Auxiliar para garantir que o diretório exista.
const ensureDirExists = (dirPath: string) => {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
};

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get("file") as unknown as File;

  if (!file) {
    return NextResponse.json(
      { success: false, message: "Nenhum arquivo foi enviado." },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Crie um nome de arquivo exclusivo para evitar sobrescrita.
  const filename = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;

  // Defina o caminho de upload
  const uploadDir = join(process.cwd(), "public", "uploads", "projects");
  const path = join(uploadDir, filename);

  // Certifique-se de que o diretório de upload exista.
  ensureDirExists(uploadDir);

  try {
    await writeFile(path, buffer);
    console.log(`Arquivo enviado para ${path}`);

    const imageUrl = `/uploads/projects/${filename}`;
    return NextResponse.json({ success: true, url: imageUrl });
  } catch (error) {
    console.error("Erro ao enviar o arquivo:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao enviar o arquivo." },
      { status: 500 }
    );
  }
}

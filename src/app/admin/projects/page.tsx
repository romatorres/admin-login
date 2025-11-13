"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, FilePenLine, Loader2, FolderKanban } from "lucide-react";
import { useProjectStore } from "@/stores/projectsStores";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { ProjectForm } from "./_components/project-form";
import Image from "next/image";
import { toast } from "sonner";

type Project = (typeof useProjectStore.arguments.projects)[0];

export default function ProjectsPage() {
  const {
    projects,
    selectedProject,
    error,
    loading,
    setSelectedProject,
    fetchProjects,
    deleteProject,
  } = useProjectStore();

  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleOpenFormDialog = (project?: Project) => {
    setSelectedProject(project || null);
    setIsFormDialogOpen(true);
  };

  const handleCloseFormDialog = () => {
    setIsFormDialogOpen(false);
    setSelectedProject(null);
  };

  const handleOpenDeleteDialog = (project: Project) => {
    setProjectToDelete(project);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setProjectToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (projectToDelete) {
      const promise = deleteProject(projectToDelete.id);
      toast.promise(promise, {
        loading: "Excluindo projeto...",
        success: "Projeto excluído com sucesso!",
        error: "Erro ao excluir projeto.",
      });
      handleCloseDeleteDialog();
    }
  };

  return (
    <div className="space-y-6 mt-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projetos</h1>
          <p>Gerencie seus projetos!</p>
        </div>
        <Button onClick={() => handleOpenFormDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Projeto
        </Button>
      </div>

      <div className="relative flex flex-col w-full h-full overflow-hidden py-2">
        {loading && projects.length === 0 ? (
          <div className="flex justify-center items-center mt-14">
            <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
            <p>Carregando projetos...</p>
          </div>
        ) : error ? (
          <div className="p-6 border-destructive/50 bg-destructive/5">
            <p className="text-destructive font-medium">{error}</p>
          </div>
        ) : projects.length === 0 ? (
          <div>
            <Card className="p-6">
              <div className="text-center">
                <FolderKanban className="h-12 w-12 mx-auto mb-3" />
                <h1 className="text-2xl mb-3">Nenhum Projeto Cadastrado!</h1>
                <p>Comece criando seu primeiro projeto!</p>
              </div>
            </Card>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative h-20 w-20 flex items-center justify-center overflow-hidden rounded-md border">
                      {project.imageUrl ? (
                        <Image
                          src={project.imageUrl}
                          alt={project.title}
                          className="h-full w-full object-cover"
                          fill
                        />
                      ) : (
                        <FolderKanban className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{project.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {project.description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm">
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {project.link}
                    </a>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenFormDialog(project)}
                    >
                      <FilePenLine className="h-4 w-4 mr-1" />
                      <span>Editar</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleOpenDeleteDialog(project)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Excluir
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={isFormDialogOpen} onOpenChange={handleCloseFormDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="admin-title text-xl">
                {selectedProject?.id ? "Editar Projeto" : "Novo Projeto"}
              </DialogTitle>
            </DialogHeader>
            <ProjectForm onSuccess={handleCloseFormDialog} />
          </DialogContent>
        </Dialog>

        <Dialog
          open={isDeleteDialogOpen}
          onOpenChange={handleCloseDeleteDialog}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
              <DialogDescription>
                Você tem certeza que deseja excluir o projeto "
                <strong>{projectToDelete?.title}</strong>"? Esta ação não pode
                ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="secondary">Cancelar</Button>
              </DialogClose>
              <Button variant="destructive" onClick={handleDeleteConfirm}>
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

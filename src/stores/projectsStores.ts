import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link?: string;
  order?: string;
  isActive: boolean;
}

interface ProjectState {
  projects: Project[];
  selectedProject: Partial<Project> | null; // singular
  loading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  createProject: (newProject: Omit<Project, "id">) => Promise<void>;
  updateProject: (id: string, updateProject: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  setSelectedProject: (project: Partial<Project> | null) => void;
}

export const useProjectStore = create<ProjectState>()(
  devtools((set, get) => ({
    // CORRIGIDO: projects (plural) + array vazio
    projects: [],
    selectedProject: null,
    loading: false,
    error: null,

    fetchProjects: async () => {
      // Evita dupla busca
      if (get().projects.length > 0) return;

      set({ loading: true, error: null });
      try {
        const response = await fetch("/api/project");
        if (!response.ok) {
          throw new Error("Erro ao buscar projetos.");
        }
        const data = await response.json();
        // Garante que sempre seja array
        set({ projects: Array.isArray(data) ? data : [], loading: false });
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Erro desconhecido";
        set({ error: message, loading: false });
      }
    },

    createProject: async (newProject) => {
      set({ loading: true, error: null });
      try {
        const response = await fetch("/api/project", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newProject),
        });
        if (!response.ok) throw new Error("Erro ao criar projeto.");
        const data = await response.json();

        set((state) => ({
          // CORRIGIDO: projects, não agendas
          projects: [...state.projects, data],
          loading: false,
        }));
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Erro ao criar";
        set({ error: message, loading: false });
      }
    },

    updateProject: async (id, updatedProject) => {
      set({ loading: true, error: null });
      try {
        const response = await fetch(`/api/project/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedProject),
        });
        if (!response.ok) throw new Error("Erro ao editar projeto.");
        const data = await response.json();

        set((state) => ({
          projects: state.projects.map((p) => (p.id === id ? data : p)),
          loading: false,
        }));
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Erro ao editar";
        set({ error: message, loading: false });
      }
    },

    deleteProject: async (id) => {
      set({ loading: true, error: null });
      try {
        const response = await fetch(`/api/project/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Erro ao excluir projeto.");

        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          loading: false,
        }));
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Erro ao excluir";
        set({ error: message, loading: false });
      }
    },

    setSelectedProject: (project) => {
      set({ selectedProject: project });
    },
  }))
);

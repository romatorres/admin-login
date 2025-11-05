import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface UserState {
  users: User[];
  selectedUser: Partial<User> | null;
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  createUser: (
    newUser: Omit<User, "id" | "createdAt" | "updatedAt"> & { password: string }
  ) => Promise<void>;
  updateUser: (
    id: string,
    updatedUser: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>
  ) => Promise<void>;
  updateUserRole: (id: string, role: string) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  setSelectedUser: (user: Partial<User> | null) => void;
  refreshUsers: () => Promise<void>; // Força uma nova busca
}

export const useUserStore = create<UserState>()(
  devtools((set, get) => ({
    users: [],
    selectedUser: null,
    loading: false,
    error: null,
    fetchUsers: async () => {
      if (get().users.length > 0) {
        return; // Evita a busca se os dados já estiverem carregados
      }
      set({ loading: true, error: null });
      try {
        const response = await fetch("/api/users");
        if (!response.ok) {
          throw new Error("Erro ao buscar usuários.");
        }
        const data = await response.json();
        set({ users: data, loading: false });
      } catch (error: unknown) {
        if (error instanceof Error) {
          set({ error: error.message, loading: false });
        }
      }
    },
    refreshUsers: async () => {
      set({ loading: true, error: null });
      try {
        const response = await fetch("/api/users");
        if (!response.ok) {
          throw new Error("Erro ao buscar usuários.");
        }
        const data = await response.json();
        set({ users: data, loading: false });
      } catch (error: unknown) {
        if (error instanceof Error) {
          set({ error: error.message, loading: false });
        }
      }
    },
    createUser: async (newUser) => {
      set({ loading: true, error: null });
      try {
        const response = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        });
        if (!response.ok) {
          throw new Error("Erro ao criar usuário.");
        }
        const data = await response.json();
        set((state) => ({
          users: [data, ...state.users],
          loading: false,
        }));
      } catch (error: unknown) {
        if (error instanceof Error) {
          set({ error: error.message, loading: false });
          throw error; // Re-throw para que o componente possa tratar
        }
      }
    },
    updateUser: async (id, updatedUser) => {
      set({ loading: true, error: null });
      try {
        const response = await fetch(`/api/users/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        });
        if (!response.ok) {
          throw new Error("Erro ao atualizar usuário.");
        }
        const data = await response.json();
        set((state) => ({
          users: state.users.map((user) => (user.id === id ? data : user)),
          loading: false,
        }));
      } catch (error: unknown) {
        if (error instanceof Error) {
          set({ error: error.message, loading: false });
          throw error; // Re-throw para que o componente possa tratar
        }
      }
    },
    deleteUser: async (id) => {
      set({ loading: true, error: null });
      try {
        const response = await fetch(`/api/users/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Erro ao excluir usuário.");
        }
        set((state) => ({
          users: state.users.filter((user) => user.id !== id),
          loading: false,
        }));
      } catch (error: unknown) {
        if (error instanceof Error) {
          set({ error: error.message, loading: false });
          throw error; // Re-throw para que o componente possa tratar
        }
      }
    },
    updateUserRole: async (id, role) => {
      set({ loading: true, error: null });
      try {
        const response = await fetch(`/api/users/${id}/role`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role }),
        });
        if (!response.ok) {
          throw new Error("Erro ao atualizar role do usuário.");
        }
        const data = await response.json();
        set((state) => ({
          users: state.users.map((user) => (user.id === id ? data : user)),
          loading: false,
        }));
      } catch (error: unknown) {
        if (error instanceof Error) {
          set({ error: error.message, loading: false });
          throw error;
        }
      }
    },
    setSelectedUser: (user) => {
      set({ selectedUser: user });
    },
  }))
);

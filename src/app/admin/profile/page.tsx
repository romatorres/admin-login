"use client";

import { Edit, Loader2, Mail, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ProfileForm } from "./_components/profile-form";
import { Card } from "@/components/ui/card";

export default function Profile() {
  const { user, isLoading, role, refetchSession } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleSuccess = () => {
    setIsDialogOpen(false);
    refetchSession();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
        <span className="text-muted-foreground">Carregando perfil...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h--full">
        <span className="text-muted-foreground">Usuário não encontrado.</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:p-4 p-1">
      {/* Header */}
      <div>
        <div className="flex md:flex-row flex-col justify-between md:items-center items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">Meu Perfil</h1>
            <p className="text-lg mb-4">Gerencie os seus dados</p>
          </div>
        </div>
      </div>

      <div className="relative flex flex-col w-full h-full overflow-hidden py-2">
        <div className="w-full text-left flex flex-col gap-4">
          <Card>
            <div className="flex flex-col gap-2">
              <p className="flex gap-2 justify-start">
                <User />
                <span className="text-xl">{user.name}</span>
              </p>
              <p className="flex gap-2 items-center antialiased leading-normal">
                <Mail className="w-4 h-4" />
                <span className="text-sm text-muted-foreground">
                  {user.email}
                </span>
              </p>
              <div className="flex gap-2 items-center mt-2">
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    role === "ADMIN"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {role}
                </span>
              </div>
            </div>

            <div className="flex gap-5 justify-end mt-4">
              <button
                className="flex text-sm text-foreground hover:text-foreground/70 antialiased font-normal leading-normal cursor-pointer"
                onClick={handleOpenDialog}
              >
                <Edit className="h-4 w-4 mr-1" />
                Editar
              </button>
            </div>
          </Card>
        </div>
      </div>
      {/* Dialog for Edit */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Editar Perfil</DialogTitle>
          </DialogHeader>
          <ProfileForm user={user} onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

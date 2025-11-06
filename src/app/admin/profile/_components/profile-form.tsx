"use client";

import { toast } from "sonner";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { authClient } from "@/lib/auth-client";
import { updateMyProfile } from "@/app/admin/users/action";

const profileFormSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
    email: z.string().email("Email inválido"),
    // Campos para alteração de senha (apenas para edição)
    currentPassword: z.string().optional().or(z.literal("")),
    newPassword: z
      .string()
      .min(8, { message: "A nova senha deve ter pelo menos 8 caracteres" })
      .optional()
      .or(z.literal("")),
    confirmNewPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      // Validação para alteração de senha
      if (data.newPassword && data.newPassword.length > 0) {
        return data.newPassword === data.confirmNewPassword;
      }
      return true;
    },
    {
      message: "As senhas não coincidem",
      path: ["confirmNewPassword"],
    }
  )
  .refine(
    (data) => {
      // Se preencheu nova senha, deve preencher senha atual
      if (data.newPassword && data.newPassword.length > 0) {
        return data.currentPassword && data.currentPassword.length > 0;
      }
      return true;
    },
    {
      message: "Senha atual é obrigatória para alterar a senha",
      path: ["currentPassword"],
    }
  );

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm({
  user,
  onSuccess,
}: {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: string;
  };
  onSuccess?: () => void;
}) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  async function handlePasswordChange(formData: ProfileFormValues) {
    if (formData.newPassword && formData.currentPassword) {
      const { error } = await authClient.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      if (error) {
        throw new Error(error.message || "Falha ao alterar senha.");
      }
    }
  }

  async function onSubmit(formData: ProfileFormValues) {
    try {
      // Atualizar dados básicos
      await updateMyProfile({
        name: formData.name,
        email: formData.email,
      });

      // Se há nova senha, alterar senha
      await handlePasswordChange(formData);

      toast.success("Perfil atualizado com sucesso!");
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Erro desconhecido");
    }
  }

  const {
    formState: { isSubmitting },
  } = form;

  const handleCancel = () => {
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmNewPassword(false);
    setIsChangingPassword(false);
    form.reset();
    onSuccess?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="admin-title">Nome</FormLabel>
              <FormControl>
                <Input
                  className="admin-input"
                  placeholder="Seu nome completo"
                  {...field}
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="admin-title">Email</FormLabel>
              <FormControl>
                <Input
                  className="admin-input"
                  placeholder="seu@email.com"
                  type="email"
                  {...field}
                  disabled={true} // Email should not be editable
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="border-t border-border pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="admin-title text-lg font-semibold">Alterar Senha</h3>
            <Button
              type="button"
              size="sm"
              className="admin-button-secondary"
              onClick={() => setIsChangingPassword(!isChangingPassword)}
            >
              {isChangingPassword ? "Cancelar" : "Alterar Senha"}
            </Button>
          </div>

          {isChangingPassword && (
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="admin-title">Senha Atual</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          className="admin-input"
                          placeholder="••••••••"
                          type={showCurrentPassword ? "text" : "password"}
                          {...field}
                          disabled={form.formState.isSubmitting}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          disabled={form.formState.isSubmitting}
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="admin-title">Nova Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          className="admin-input"
                          placeholder="••••••••"
                          type={showNewPassword ? "text" : "password"}
                          {...field}
                          disabled={form.formState.isSubmitting}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          disabled={form.formState.isSubmitting}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmNewPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="admin-title">
                      Confirmar Nova Senha
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          className="admin-input"
                          placeholder="••••••••"
                          type={showConfirmNewPassword ? "text" : "password"}
                          {...field}
                          disabled={form.formState.isSubmitting}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() =>
                            setShowConfirmNewPassword(!showConfirmNewPassword)
                          }
                          disabled={form.formState.isSubmitting}
                        >
                          {showConfirmNewPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="secondary"
            className="admin-button-secondary"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="admin-button-primary"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Alterações"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

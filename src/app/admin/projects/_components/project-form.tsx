"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, FileText, Type, FileImage } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useProjectStore } from "@/stores/projectsStores";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
  title: z
    .string()
    .min(1, { message: "O título é obrigatório." })
    .min(3, { message: "O título deve ter pelo menos 3 caracteres." })
    .max(100, { message: "O título deve ter no máximo 100 caracteres." }),
  imageUrl: z
    .string()
    .min(1, { message: "A imagem do projeto é obrigatória." }),
  link: z.string().optional(),
  description: z
    .string()
    .max(500, { message: "Os detalhes devem ter no máximo 500 caracteres." }),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof formSchema> & { isActive: boolean };

interface AgendaFormProps {
  onSuccess?: () => void;
}

export function ProjectForm({ onSuccess }: AgendaFormProps) {
  const { createProject, updateProject, selectedProject, setSelectedProject } =
    useProjectStore();
  const [imageSource, setImageSource] = useState<"url" | "file">("url");
  const [isUploading, setIsUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      imageUrl: "",
      description: "",
      link: "",
      isActive: true,
    },
  });

  const {
    formState: { isSubmitting },
    watch,
    getValues,
  } = form;

  const isEditing = !!selectedProject?.id;
  const watchedDetalhes = watch("description");
  const watchedImageUrl = watch("imageUrl");

  useEffect(() => {
    return () => {
      const currentImageUrl = getValues("imageUrl");
      if (currentImageUrl && currentImageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(currentImageUrl);
      }
    };
  }, [getValues]);

  useEffect(() => {
    const currentImageUrl = getValues("imageUrl");
    if (currentImageUrl && currentImageUrl.startsWith("blob:")) {
      URL.revokeObjectURL(currentImageUrl);
    }
    setImageFile(null);

    if (isEditing && selectedProject?.id) {
      form.reset({
        title: selectedProject.title || "",
        imageUrl: selectedProject.imageUrl || "",
        description: selectedProject.description || "",
        link: selectedProject.link || "",
        isActive: selectedProject.isActive ?? true,
      });
      if (selectedProject.imageUrl) {
        setImageSource("url");
      }
    } else {
      form.reset({
        title: "",
        imageUrl: "",
        description: "",
        link: "",
        isActive: true,
      });
      setImageSource("url");
    }
  }, [selectedProject, form, isEditing, getValues]);

  const handleImageSourceChange = (source: "url" | "file") => {
    const currentImageUrl = getValues("imageUrl");
    if (currentImageUrl && currentImageUrl.startsWith("blob:")) {
      URL.revokeObjectURL(currentImageUrl);
    }
    setImageFile(null);
    form.setValue("imageUrl", "", { shouldValidate: true });
    setImageSource(source);
  };

  const onSubmit = async (values: FormValues) => {
    try {
      let submissionImageUrl = values.imageUrl;

      if (imageFile && imageSource === "file") {
        setIsUploading(true);
        try {
          const formData = new FormData();
          formData.append("file", imageFile);

          const response = await fetch("/api/upload-local", {
            method: "POST",
            body: formData,
          });

          const result = await response.json();
          if (!result.success) {
            throw new Error(result.message || "Erro no upload da imagem.");
          }
          submissionImageUrl = result.url;
        } finally {
          setIsUploading(false);
        }
      }

      const dataToSubmit = {
        ...values,
        imageUrl: submissionImageUrl,
      };

      if (isEditing) {
        await updateProject(selectedProject.id!, dataToSubmit);
        toast.success("Projeto atualizado com sucesso!");
      } else {
        await createProject(dataToSubmit);
        toast.success("Projeto criado com sucesso!");
      }

      setSelectedProject(null);
      onSuccess?.();
    } catch (error) {
      console.error("Erro ao salvar projeto:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao salvar o projeto."
      );
    } finally {
      if (values.imageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(values.imageUrl);
      }
      setImageFile(null);
    }
  };

  const handleCancel = () => {
    const currentImageUrl = getValues("imageUrl");
    if (currentImageUrl && currentImageUrl.startsWith("blob:")) {
      URL.revokeObjectURL(currentImageUrl);
    }
    setImageFile(null);
    setSelectedProject(null);
    onSuccess?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center font-medium">
                <Type className="h-4 w-4" />
                Título do Projeto
              </FormLabel>
              <FormControl>
                <Input placeholder="Site Banda Flashback..." {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                {field.value?.length || 0}/100 caracteres
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center font-medium">
                <FileImage className="h-4 w-4 mr-2" />
                Imagem do projeto
              </FormLabel>
              <div className="flex gap-2 mb-2">
                <Button
                  type="button"
                  variant={imageSource === "url" ? "secondary" : "ghost"}
                  onClick={() => handleImageSourceChange("url")}
                >
                  URL
                </Button>
                <Button
                  type="button"
                  variant={imageSource === "file" ? "secondary" : "ghost"}
                  onClick={() => handleImageSourceChange("file")}
                >
                  Upload
                </Button>
              </div>
              {imageSource === "url" ? (
                <FormControl>
                  <Input
                    placeholder="https://example.com/image.jpg"
                    {...field}
                  />
                </FormControl>
              ) : (
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const currentImageUrl = getValues("imageUrl");
                          if (
                            currentImageUrl &&
                            currentImageUrl.startsWith("blob:")
                          ) {
                            URL.revokeObjectURL(currentImageUrl);
                          }
                          setImageFile(file);
                          const previewUrl = URL.createObjectURL(file);
                          form.setValue("imageUrl", previewUrl, {
                            shouldValidate: true,
                          });
                        }
                      }}
                      disabled={isSubmitting}
                    />
                  </div>
                </FormControl>
              )}

              {watchedImageUrl && (
                <div className="mt-4 relative w-full h-48 rounded-md overflow-hidden border">
                  <img
                    src={watchedImageUrl}
                    alt="Pré-visualização da imagem"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              <FormDescription className="text-xs">
                {imageSource === "file"
                  ? "Faça o upload de uma imagem."
                  : "Insira a URL de uma imagem."}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center font-medium">
                <Type className="h-4 w-4" />
                Link do Projeto
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="https://bandaflashback.com.br..."
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-xs">
                {field.value?.length || 0}/100 caracteres
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center font-medium">
                <FileText className="h-4 w-4" />
                Descrição
              </FormLabel>
              <FormControl>
                <Textarea
                  className="min-h-[100px]"
                  placeholder="Adicione informações extras sobre o projeto..."
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-xs">
                {watchedDetalhes?.length || 0}/500 caracteres
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {isEditing && (
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Ativar Projeto</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end gap-3 pt-4 ">
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting || isUploading}>
            {isSubmitting || isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isUploading
                  ? "Enviando imagem..."
                  : isEditing
                  ? "Atualizando..."
                  : "Criando..."}
              </>
            ) : (
              <>{isEditing ? "Atualizar Projeto" : "Criar Projeto"}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

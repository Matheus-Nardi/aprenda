// CreatePostForm.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ArchiveService } from "@/lib/services/ArchiveService";
import { ProfessorService } from "@/lib/services/ProfessorService";

import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface PostFormProps {
  classroomId: number;
  onSuccess: () => void;
}

export default function CreatePostForm({ classroomId, onSuccess }: PostFormProps) {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      // Adiciona os novos arquivos à lista existente
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

   const handleRemoveFile = (indexToRemove: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  
  const formSchema = z.object({
    title: z.string(),
    content: z.string(),
    isFixed: z.boolean().optional(),
    attachmentsIds: z.array(z.number()).optional(),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      isFixed: false,
      attachmentsIds: [],
    },
  });

 async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      let attachmentIds: number[] = [];
      if (files.length > 0) {
        toast.info("Enviando anexos...");

       
        const uploadPromises = files.map(file => 
            ArchiveService.uploadFile(file) 
        );

      
        const uploadResults = await Promise.all(uploadPromises);
        attachmentIds = uploadResults.map(result => result.id);
      }

      const postPayload = {
        title: values.title,
        content: values.content,
        isFixed: values.isFixed,
        AttachmentIds: attachmentIds
      };

      await ProfessorService.createPost(postPayload, classroomId);
      
      toast.success(`Postagem criada com sucesso!`);
      onSuccess(); 
      form.reset();
      setFiles([]); 
      
    } catch (error) {
      console.error("Erro ao criar postagem:", error);
      toast.error("Erro ao criar postagem. Tente novamente.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Título da postagem" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conteúdo</FormLabel>
              <FormControl>
                <Input placeholder="Conteúdo da postagem" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

         <FormItem>
          <FormLabel>Anexos</FormLabel>
          <FormControl>
            <Input
              type="file"
              multiple 
              onChange={handleFileChange}
              className="cursor-pointer"
            />
          </FormControl>
          <FormMessage />
        </FormItem>


        {files.length > 0 && (
          <div className="space-y-2">
            <FormLabel>Arquivos selecionados:</FormLabel>
            <ul className="list-disc list-inside bg-muted p-4 rounded-md">
              {files.map((file, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span>{file.name}</span>
                  <Button
                    type="button" 
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button type="submit" className="w-full" size="lg" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Salvando..." : "Salvar"}
        </Button>
      </form>
    </Form>
  );
}

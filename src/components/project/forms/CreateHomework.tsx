// CreateHomeworkForm.tsx
"use client";
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArchiveService } from "@/lib/services/ArchiveService";
import { ProfessorService } from "@/lib/services/ProfessorService";
import { cn } from "@/lib/utils";
import { format } from "date-fns"
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, X } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Calendar } from "@/components/ui/calendar"
import { ptBR } from "date-fns/locale/pt-BR";

interface HomeworkFormProps {
  classroomId: number;
  onSuccess: () => void;
}

export default function CreateHomeworkForm({ classroomId, onSuccess }: HomeworkFormProps) {
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
    dueDate: z.date().optional(),
    enableDueDate: z.boolean().default(false).optional(),
  }).refine((data) => {
    if (data.enableDueDate) {
      return data.dueDate !== undefined;
    }
    return true;
  }, {
    message: "A data de entrega é obrigatória quando habilitada.",
    path: ["dueDate"],
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      isFixed: false,
      attachmentsIds: [],
      dueDate: undefined,
      enableDueDate: false,
    },
  });

  const isDueDateEnabled = form.watch("enableDueDate");

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

      const HomeworkPayload = {
        title: values.title,
        content: values.content,
        isFixed: values.isFixed,
        AttachmentIds: attachmentIds,
        dueDate: values.enableDueDate ? values.dueDate : undefined,
      };

      await ProfessorService.createHomework(HomeworkPayload, classroomId);
      
      toast.success(`Atividade criada com sucesso!`);
      console.log("Atividade criada:", HomeworkPayload);
      onSuccess(); 
      form.reset();
      setFiles([]); 
      
    } catch (error) {
      console.error("Erro ao criar atividade:", error);
      toast.error("Erro ao criar atividade. Tente novamente.");
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
                <Input placeholder="Título da Atividade" {...field} />
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
                <Input placeholder="Instruções da atividade" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="enableDueDate"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Habilitar data de entrega</FormLabel>
                <FormDescription>
                  Marque para definir um prazo para esta atividade.
                </FormDescription>
              </div>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* CAMPO DE DATA CONDICIONAL */}
        {isDueDateEnabled && (
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Entrega</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: ptBR })
                        ) : (
                          <span>Escolha uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

         <FormItem>
          <FormLabel>Anexos</FormLabel>
          <FormControl>
            <Input
              type="file"
              multiple 
              onChange={handleFileChange}
              className="cursor-pointer"
              accept="application/pdf, image/*, .zip, application/zip"
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

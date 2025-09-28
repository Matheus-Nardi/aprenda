// CreateClassroomForm.tsx
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
import { ClassroomService } from "@/lib/services/ClassroomSerivce";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface ClassroomFormProps {
  onSuccess: () => void;
}

export default function CreateClassroomForm({ onSuccess }: ClassroomFormProps) {
  const formSchema = z.object({
    name: z.string(),
    description: z.string(),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const classroom = await ClassroomService.createClassroom(values);
      toast.success(`Sala de aula ${classroom?.name} criada com sucesso!`);
      onSuccess();
      form.reset();
    } catch (error) {
      console.error("Erro ao criar sala de aula:", error);
      toast.error("Erro ao criar sala de aula. Tente novamente.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome da sala de aula" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input placeholder="Descrição da sala de aula" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" size="lg" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Salvando..." : "Salvar"}
        </Button>
      </form>
    </Form>
  );
}

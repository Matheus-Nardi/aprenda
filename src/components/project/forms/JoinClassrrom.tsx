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
import { StudentService } from "@/lib/services/StudentService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface ClassroomFormProps {
  onSuccess: () => void;
}

export default function JoinClassroomForm({ onSuccess }: ClassroomFormProps) {
  const formSchema = z.object({
    code: z.string().min(6).max(6),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await StudentService.joinClassroom(values.code);
      toast.success(`Você entrou na sala de aula ${values.code} com sucesso!`);
      onSuccess();
      form.reset();
    } catch (error) {
      console.error("Erro ao entrar na sala de aula:", error);
      toast.error("Erro ao entrar na sala de aula. Tente novamente.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código</FormLabel>
              <FormControl>
                <Input placeholder="Código da sala de aula" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" size="lg" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </Form>
  );
}

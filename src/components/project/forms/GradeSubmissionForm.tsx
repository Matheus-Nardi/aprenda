// GradeSubmissionForm.tsx
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
import { Textarea } from "@/components/ui/textarea";
import { ProfessorService } from "@/lib/services/ProfessorService";
import { Submission } from "@/types/Submission/Submission";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface GradeSubmissionFormProps {
  submission: Submission;
  onSuccess: () => void;
}

const formSchema = z.object({
  value: z
    .number()
    .min(0, "A nota mínima é 0")
    .max(10, "A nota máxima é 10"),
  feedback: z.string().min(1, "O feedback é obrigatório."),
});

export default function GradeSubmissionForm({
  submission,
  onSuccess,
}: GradeSubmissionFormProps) {
  const form = useForm<z.input<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: 0,
      feedback: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await ProfessorService.gradeSubmission(submission.id, values);
      toast.success(`Nota atribuída com sucesso!`);
      onSuccess();
      form.reset();
    } catch (error) {
      console.error("Erro ao atribuir a nota:", error);
      toast.error("Erro ao atribuir a nota. Tente novamente.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nota</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.1" // Permite notas decimais
                  placeholder="Nota de 0 a 10"
                  {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="feedback"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Feedback</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Escreva um feedback construtivo para o aluno..."
                  className="resize-y min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Avaliando..." : "Avaliar e Salvar"}
        </Button>
      </form>
    </Form>
  );
}

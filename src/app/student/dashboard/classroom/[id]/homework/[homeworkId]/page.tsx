"use client";

import { useState, useEffect } from "react";
import { ClassroomService } from "@/lib/services/ClassroomSerivce";
import { StudentService } from "@/lib/services/StudentService";
import { useAuth } from "@/hooks/useAuth";

import HomeworkStudent from "@/components/project/classroom/HomeworkStudent";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, BookOpen } from "lucide-react";

import type { Homework } from "@/types/Post/Homework";
import type { Submission } from "@/types/Submission/Submission";

interface HomeworkPageProps {
  params: Promise<{ homeworkId: string }>;
}

export default function HomeworkPage({ params }: HomeworkPageProps) {
  const [homework, setHomework] = useState<Homework | null>(null);
  const [submissions, setSubmissions] = useState<Submission[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const { homeworkId } = await params;
      const homeworkIdInt = +homeworkId;

      const [homeworkData, submissionData] = await Promise.all([
        ClassroomService.getHomeworkById(homeworkIdInt),
        StudentService.getSubmissionByHomework(homeworkIdInt),
      ]);

      if (!homeworkData) {
        setError("Tarefa não encontrada");
        setLoading(false);
        return;
      }

      setHomework(homeworkData);
      setSubmissions(submissionData);
    } catch (err) {
      console.error("Erro ao carregar dados da tarefa:", err);
      setError("Ocorreu um erro ao carregar os dados da tarefa.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [params]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Carregando tarefa...</span>
        </div>
      </div>
    );
  }

  if (error || !homework) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <BookOpen className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              {error || "Tarefa não encontrada"}
            </h3>
            <p className="mb-6 text-muted-foreground">
              Não foi possível carregar os dados da tarefa. Por favor, tente
              novamente.
            </p>
            <Button onClick={loadData}>Tentar Novamente</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full bg-muted/40 p-4 py-8 sm:p-6 md:py-12">
      <div className="mx-auto w-full max-w-4xl">
        <HomeworkStudent
          homework={homework}
          submissions={submissions}
          user={user}
          onSuccess={loadData}
        />
      </div>
    </main>
  );
}
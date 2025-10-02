"use client";

import { useState, useEffect } from "react";
import HeaderClassroom from "@/components/project/classroom/HeaderClassroom";
import CardPost from "@/components/project/classroom/CardPost";
import CardHomework from "@/components/project/classroom/CardHomework";
import { ClassroomService } from "@/lib/services/ClassroomSerivce";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Classroom } from "@/types/Classroom/Classroom";
import type { Post } from "@/types/Post/Post";
import type { Homework } from "@/types/Post/Homework";
import { Plus, MessageSquare, BookOpen, Users, Loader2 } from "lucide-react";
import { ProfessorService } from "@/lib/services/ProfessorService";
import { GenericFormDialog } from "@/components/project/dialog/GenericDialogForm";
import CreatePostForm from "@/components/project/forms/CreatePost";
import Home from "@/app/page";
import HomeworkStudent from "@/components/project/classroom/HomeworkStudent";
import { useAuth } from "@/hooks/useAuth";
import { StudentService } from "@/lib/services/StudentService";
import { Submission } from "@/types/Submission/Submission";
import { set } from "zod";

interface HomeworkPageProps {
  params: Promise<{ homeworkId: string }>;
}

export default function HomeworkPage({ params }: HomeworkPageProps) {
  const [homework, setHomework] = useState<Homework | null>(null);
  const [submissions, setSubmissions] = useState<Submission[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const user = useAuth().user;

  const loadData = async () => {
    try {
      setLoading(true);
      const { homeworkId } = await params;
      const homeworkIdInt = +homeworkId;

      const homeworkData = await ClassroomService.getHomeworkById(
        homeworkIdInt
      );
      const submissionData = await StudentService.getSubmissionByHomework(
        homeworkIdInt
      );
      console.log("aluno", homeworkData);
      if (!homeworkData) {
        setError("Tarefa não encontrada");
        return;
      }

      setHomework(homeworkData);
      setSubmissions(submissionData);

      console.log("homework", homeworkData);
    } catch (error) {
      console.error("Erro ao carregar tarefa:", error);
      setError("Erro ao carregar tarefa");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Carregando tarefa...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !homework) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-screen">
          <Card className="max-w-md mx-4">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {error || "Turma não encontrada"}
              </h3>
              <p className="text-muted-foreground mb-6">
                Não foi possível carregar os dados da tarefa. Tente novamente.
              </p>
              <Button onClick={() => window.location.reload()}>
                Tentar Novamente
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <HomeworkStudent
      homework={homework}
      submissions={submissions}
      user={user}
      onSuccess={() => loadData()}
    />
  );
}

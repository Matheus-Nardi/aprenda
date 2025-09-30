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

interface ClassroomPageProps {
  params: Promise<{ id: string }>;
}

export default function ClassroomPage({ params }: ClassroomPageProps) {
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

 
    const loadData = async () => {
      try {
        setLoading(true);
        const { id } = await params;
        const classroomId = +id;

        const [classroomData, postsData, homeworksData] = await Promise.all([
          ClassroomService.getClassroomById(classroomId),
          ProfessorService.getClassroomPosts(classroomId),
          ProfessorService.getClassroomHomeworks(classroomId),
        ]);

        console.log("aluno" , homeworksData);
        if (!classroomData) {
          setError("Turma não encontrada");
          return;
        }

        setClassroom(classroomData);
        setPosts(postsData || []);
        setHomeworks(homeworksData || []);

        console.log("data posts", postsData);
      } catch (error) {
        console.error("Erro ao carregar turma:", error);
        setError("Erro ao carregar turma");
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
            <span>Carregando turma...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !classroom) {
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
                Não foi possível carregar os dados da turma. Tente novamente.
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

  const studentCount = classroom.users.filter(
    (user) => user.profile === 3
  ).length;

  return (
    <div className="min-h-screen bg-background container max-w-6xl mx-auto px-4 py-8 space-y-8">
      <HeaderClassroom classroom={classroom} />

      <div className="container max-w-screen-2xl px-4 py-8">
        <Tabs defaultValue="posts" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <TabsList className="grid w-full sm:w-auto grid-cols-3 bg-white border border-border/40">
              <TabsTrigger value="posts" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Publicações</span>
                <span className="sm:hidden">Posts</span>
                <Badge
                  variant="secondary"
                  className="ml-1 bg-primary/10 text-primary"
                >
                  {posts.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="homeworks"
                className="flex items-center gap-2"
              >
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Atividades</span>
                <span className="sm:hidden">Tarefas</span>
                <Badge
                  variant="secondary"
                  className="ml-1 bg-secondary/10 text-secondary-foreground"
                >
                  {homeworks.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="students" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Alunos</span>
                <Badge
                  variant="secondary"
                  className="ml-1 bg-accent/10 text-accent-foreground"
                >
                  {studentCount}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="posts" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">
                  Publicações da Turma
                </h2>
                <Badge variant="outline" className="bg-white border-border/40">
                  {posts.length}{" "}
                  {posts.length === 1 ? "publicação" : "publicações"}
                </Badge>
              </div>

              {posts.length === 0 ? (
                <Card className="border-border/40 bg-white">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      Nenhuma publicação ainda
                    </h3>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <CardPost key={post.id} post={post} />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="homeworks" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">
                  Atividades da Turma
                </h2>
                <Badge variant="outline" className="bg-white border-border/40">
                  {homeworks.length}{" "}
                  {homeworks.length === 1 ? "atividade" : "atividades"}
                </Badge>
              </div>

               {homeworks.length === 0 ? (
                <Card className="border-border/40 bg-white">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      Nenhuma atividade ainda
                    </h3>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {homeworks.map((homework) => (
                    <CardHomework key={homework.id} homework={homework} />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">
                  Alunos da Turma
                </h2>
                <Badge variant="outline" className="bg-white border-border/40">
                  {studentCount} {studentCount === 1 ? "aluno" : "alunos"}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {classroom.users
                  .filter((user) => user.profile === 3)
                  .map((student) => (
                    <Card
                      key={student.id}
                      className="border-border/40 bg-white hover:border-primary/50 transition-colors"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {student.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-foreground truncate">
                              {student.name}
                            </h3>
                            <p className="text-sm text-muted-foreground truncate">
                              {student.email}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>

    
  );
}

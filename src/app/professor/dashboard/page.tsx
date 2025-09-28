"use client";

import CardClassroom from "@/components/project/classroom/CardClassroom";
import { ProfessorService } from "@/lib/services/ProfessorService";
import type { Classroom } from "@/types/Classroom/Classroom";
import { use, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  BookOpen,
  GraduationCap,
  Plus,
  Search,
  Filter,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { GenericFormDialog } from "@/components/project/dialog/GenericDialogForm";
import CreateClassroom from "@/components/project/forms/CreateClassroom";

interface DashboardStats {
  totalClassrooms: number;
  totalStudents: number;
  totalTeachers: number;
  averageStudentsPerClass: number;
}

export default function DashboardProfessorPage() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const route = useRouter();

  const loadData = async () => {
    try {
      setLoading(true);
      const [classroomsData] = await Promise.all([
        ProfessorService.getClassrooms(),
      ]);

      setClassrooms(classroomsData || []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredClassrooms = classrooms.filter(
    (classroom) =>
      classroom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classroom.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-screen-2xl px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function handleClassroomClick(id: number): void {
    route.push(`/professor/dashboard/classroom/${id}`);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Dashboard do Professor
              </h1>
              <p className="text-muted-foreground mt-1">
                Gerencie suas turmas e acompanhe o progresso dos alunos
              </p>
            </div>
            <Button className="w-fit" onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Turma
            </Button>
          </div>

          <GenericFormDialog
            title="Criar Novo Usuário"
            description="Preencha os dados abaixo para adicionar um novo usuário ao sistema."
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
          >
            <CreateClassroom
              onSuccess={() => {
                console.log("Formulário enviado, fechando o dialog.");
                loadData()
                setIsDialogOpen(false);
              }}
            />
          </GenericFormDialog>

          {/* Stats Cards */}
          {/* {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-border/40 bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total de Turmas</CardTitle>
                  <BookOpen className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stats.totalClassrooms}</div>
                  <p className="text-xs text-muted-foreground mt-1">Turmas ativas</p>
                </CardContent>
              </Card>

              <Card className="border-border/40 bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total de Alunos</CardTitle>
                  <Users className="h-4 w-4 text-secondary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stats.totalStudents}</div>
                  <p className="text-xs text-muted-foreground mt-1">Estudantes matriculados</p>
                </CardContent>
              </Card>

              <Card className="border-border/40 bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Professores</CardTitle>
                  <GraduationCap className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stats.totalTeachers}</div>
                  <p className="text-xs text-muted-foreground mt-1">Colaboradores</p>
                </CardContent>
              </Card>

              <Card className="border-border/40 bg-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Média por Turma</CardTitle>
                  <TrendingUp className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stats.averageStudentsPerClass}</div>
                  <p className="text-xs text-muted-foreground mt-1">Alunos por turma</p>
                </CardContent>
              </Card>
            </div>
          )} */}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar turmas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-border/40"
            />
          </div>
          <Button variant="outline" className="w-fit bg-white border-border/40">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-foreground">
                Suas Turmas
              </h2>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {filteredClassrooms.length}{" "}
                {filteredClassrooms.length === 1 ? "turma" : "turmas"}
              </Badge>
            </div>
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchTerm("")}
                className="text-muted-foreground hover:text-foreground"
              >
                Limpar busca
              </Button>
            )}
          </div>

          {filteredClassrooms.length === 0 ? (
            <Card className="border-border/40 bg-white">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {searchTerm
                    ? "Nenhuma turma encontrada"
                    : "Nenhuma turma cadastrada"}
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  {searchTerm
                    ? "Tente ajustar os termos de busca ou limpar os filtros."
                    : "Comece criando sua primeira turma para organizar seus alunos e materiais."}
                </p>
                {!searchTerm && (
                  <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeira Turma
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClassrooms.map((classroom) => (
                <CardClassroom
                  key={classroom.id}
                  classroom={classroom}
                  onClick={() => handleClassroomClick(classroom.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

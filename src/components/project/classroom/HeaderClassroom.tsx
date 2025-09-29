import type { Classroom } from "@/types/Classroom/Classroom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Calendar, BookOpen, Settings, UserPlus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface HeaderClassroomProps {
  classroom: Classroom;
}

export default function HeaderClassroom({ classroom }: HeaderClassroomProps) {
  const studentCount = classroom.users.filter(
    (user) => user.profile === 3
  ).length;
  const teachers = classroom.users.filter((user) => user.profile === 2);
  const createdDate = new Date(classroom.createdAt).toLocaleDateString(
    "pt-BR",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const getClassroomInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const user = useAuth();

  return (
    <header className="w-full bg-background border-b border-border/40">
      {/* Right side - Actions */}
      {user?.user?.profile === 2 && (
        <>
          <div className="flex-end items-center gap-2 lg:ml-auto">
            <Button
              variant="outline"
              size="sm"
              className="bg-white border-border/40"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Adicionar Aluno
            </Button>
          </div>
          <div className="flex-end items-center gap-2 lg:ml-auto">
            <Button
              variant="outline"
              size="sm"
              className="bg-white border-border/40"
            >
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
          </div>
        </>
      )}

      {/* Full-width banner */}
      <div className="w-full h-32 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/classroom-pattern.svg')] opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent"></div>
      </div>

      {/* Content container */}
      <div className="container max-w-screen-2xl px-4 -mt-16 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end gap-6 pb-6">
          {/* Left side - Avatar and basic info */}
          <div className="flex items-end gap-4">
            {/* Classroom Avatar */}
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-background shadow-lg bg-white">
                <AvatarImage
                  src={`/classroom-.jpg?height=96&width=96&query=classroom+${classroom.name}`}
                  alt={classroom.name}
                />
                <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                  {getClassroomInitials(classroom.name)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-primary rounded-full border-2 border-background flex items-center justify-center">
                <BookOpen className="h-3 w-3 text-primary-foreground" />
              </div>
            </div>

            {/* Basic classroom info */}
            <div className="space-y-1 pb-2">
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                {classroom.name}
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>
                    {studentCount} {studentCount === 1 ? "aluno" : "alunos"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Criada em {createdDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed information section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">
          {/* Description */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Descrição
            </h3>
            <p className="text-foreground leading-relaxed">
              {classroom.description ||
                "Nenhuma descrição disponível para esta turma."}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

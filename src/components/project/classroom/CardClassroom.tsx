"use client";

import type { Classroom } from "@/types/Classroom/Classroom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Calendar, BookOpen, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CardClassroomProps {
  classroom: Classroom;
  onClick?: () => void;
}

export default function CardClassroom({ classroom, onClick }: CardClassroomProps) {
  const studentCount = classroom.users.filter((user) => user.profile === 3).length;
  const teachers = classroom.users.filter((user) => user.profile === 2);
  const createdDate = new Date(classroom.createdAt).toLocaleDateString("pt-BR");
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Previne que o clique no botão acione o onClick do Card
    if (!classroom.inviteCode) return;

    try {
      await navigator.clipboard.writeText(classroom.inviteCode);
      toast.success("Código copiado!");
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      toast.error("Falha ao copiar o código.");
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <Card
      className="hover:border-primary/50 transition-all duration-200 cursor-pointer bg-white border-border/40"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-foreground mb-1 line-clamp-1">
              {classroom.name}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground line-clamp-2">
              {classroom.description}
            </CardDescription>
          </div>
          <BookOpen className="h-5 w-5 text-primary/60 flex-shrink-0 ml-3" />
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>
              {studentCount} {studentCount === 1 ? "aluno" : "alunos"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{createdDate}</span>
          </div>
        </div>

        {teachers.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {teachers.length === 1 ? "Professor" : "Professores"}
            </p>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {teachers.slice(0, 3).map((teacher) => (
                  <Avatar key={teacher.id} className="h-6 w-6 border-2 border-background">
                    <AvatarImage src="/boy.png" alt={teacher.name} />
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {teacher.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {teachers.length > 3 && (
                  <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">+{teachers.length - 3}</span>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-1">
                {teachers.slice(0, 2).map((teacher) => (
                  <Badge key={teacher.id} variant="secondary" className="text-xs px-2 py-0.5">
                    {teacher.name.split(" ")[0]}
                  </Badge>
                ))}
                {teachers.length > 2 && (
                  <Badge variant="outline" className="text-xs px-2 py-0.5">
                    +{teachers.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )}

        <Badge variant="outline">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              Código: {classroom.inviteCode}
            </span>
            <button
              onClick={handleCopy}
              title="Copiar código"
              className="p-1 rounded-md hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {isCopied ? (
                <Check className="h-4 w-4 text-green-500 transition-all" />
              ) : (
                <Copy className="h-4 w-4 text-muted-foreground transition-all" />
              )}
            </button>
          </div>
        </Badge>
      </CardContent>
    </Card>
  );
}
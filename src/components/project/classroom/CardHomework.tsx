import type { Homework } from "@/types/Post/Homework";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Users,
  CheckCircle,
  AlertCircle,
  FileText,
} from "lucide-react";
import { ESubmissionStatus } from "@/types/Submission/ESubmissionStatus";
import { useAuth } from "@/hooks/useAuth";

interface CardHomeworkProps {
  homework: Homework;
}

export default function CardHomework({ homework }: CardHomeworkProps) {
  const dueDate = homework.dueDate ? new Date(homework.dueDate) : null;
  const now = new Date();
  const isOverdue = dueDate ? dueDate < now : false;
  const isToday = dueDate ? dueDate.toString() === now.toDateString() : false;

  const user = useAuth().user;

  const isTeacher = user?.profile === 2;
  const submittedCount = homework.submissions.filter(
    (s) =>
      s.status === ESubmissionStatus.SUBMITTED ||
      s.status === ESubmissionStatus.GRADED
  ).length;
  const gradedCount = homework.submissions.filter(
    (s) => s.status === ESubmissionStatus.GRADED
  ).length;
  const totalSubmissions = homework.submissions.length;

  const getStatusBadge = () => {
    if (!dueDate) {
      return (
        <Badge
          variant="outline"
          className="text-xs border-primary/20 text-primary bg-primary/5"
        >
          Ativo
        </Badge>
      );
    }
    if (isOverdue) {
      return (
        <Badge variant="destructive" className="text-xs">
          Vencido
        </Badge>
      );
    }
    if (isToday) {
      return (
        <Badge
          variant="outline"
          className="text-xs border-amber-200 text-amber-700 bg-amber-50"
        >
          Hoje
        </Badge>
      );
    }
    return (
      <Badge
        variant="outline"
        className="text-xs border-primary/20 text-primary bg-primary/5"
      >
        Ativo
      </Badge>
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="hover:border-primary/50 transition-all duration-200 bg-white border-border/40">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <Avatar className="h-9 w-9 flex-shrink-0">
              <AvatarImage
                src={homework.user.avatar?.storedName || "/placeholder.svg"}
                alt={homework.user.name}
              />
              <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">
                {homework.user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-sm leading-tight truncate">
                {homework.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Por {homework.user.name}
              </p>
            </div>
          </div>

          {getStatusBadge()}
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {homework.content}
        </p>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {dueDate ? (
              <span>
                Entrega {isOverdue ? "em" : "até"} {formatDate(dueDate)}
              </span>
            ) : (
              <span>Sem data de entrega</span>
            )}
          </div>

          {homework.archives && homework.archives.length > 0 && (
            <div className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              <span>
                {homework.archives.length} anexo
                {homework.archives.length > 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {isTeacher && (
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border/40">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <div className="text-sm font-medium text-foreground">
                {totalSubmissions}
              </div>
              <div className="text-xs text-muted-foreground">Alunos</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <CheckCircle className="h-3.5 w-3.5 text-secondary" />
              </div>
              <div className="text-sm font-medium text-foreground">
                {submittedCount}
              </div>
              <div className="text-xs text-muted-foreground">Entregues</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <AlertCircle className="h-3.5 w-3.5 text-accent" />
              </div>
              <div className="text-sm font-medium text-foreground">
                {gradedCount}
              </div>
              <div className="text-xs text-muted-foreground">Avaliados</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

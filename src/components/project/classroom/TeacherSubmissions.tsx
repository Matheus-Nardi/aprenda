"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
// Imports adicionados para o Dialog
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, FileText, Search } from "lucide-react";
import { Homework } from "@/types/Post/Homework";
import { Submission } from "@/types/Submission/Submission";
import { ESubmissionStatus } from "@/types/Submission/ESubmissionStatus";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
// Importe o componente que será exibido no modal
import ActionsSubmission from "./ActionsSubmission";

interface SubmissionProps {
  homework: Homework;
  submissions?: Submission[] | null;
  onSuccess?: () => void;
}

const statusConfig = {
  PENDING: {
    label: "Pendente",
    className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
  SUBMITTED: {
    label: "Enviado",
    className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  GRADED: {
    label: "Avaliado",
    className: "bg-green-500/10 text-green-600 border-green-500/20",
  },
  OVERDUE: {
    label: "Atrasado",
    className: "bg-red-500/10 text-red-600 border-red-500/20",
  },
};

export default function TeacherSubmissionsPage({
  homework,
  submissions,
  onSuccess,
}: SubmissionProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // 1. Estados para controlar o modal e a submissão selecionada
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // 2. Função para abrir o modal com a submissão correta
  const handleViewDetails = (submission: Submission) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  const handleSuccessAndCloseModal = () => {
    setIsModalOpen(false);
    onSuccess?.();
  };

  const stats = {
    total: submissions?.length ?? 0,
    pending:
      submissions?.filter((s) => s.status === ESubmissionStatus.SUBMITTED)
        .length ?? 0,
    graded:
      submissions?.filter((s) => s.status === ESubmissionStatus.GRADED)
        .length ?? 0,
    late:
      submissions?.filter((s) => s.status === ESubmissionStatus.OVERDUE)
        .length ?? 0,
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Submissões da Atividade: {homework.title}
          </h1>
          <p className="mt-1 text-muted-foreground">
            Gerencie e avalie as atividades enviadas pelos estudantes.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader>
              <CardDescription>Total</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Aguardando Avaliação</CardDescription>
              <CardTitle className="text-3xl text-blue-500">
                {stats.pending}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Avaliadas</CardDescription>
              <CardTitle className="text-3xl text-green-500">
                {stats.graded}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Atrasadas</CardDescription>
              <CardTitle className="text-3xl text-red-500">
                {stats.late}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Filters and Table */}
        <Card className="border-border/50">
          <CardHeader>
            <div className="relative flex-1 md:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por estudante..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-border/50">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border/50">
                    <TableHead className="w-[250px]">Estudante</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data de Envio</TableHead>
                    <TableHead>Avaliação</TableHead>
                    <TableHead>Arquivos</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        Nenhuma submissão encontrada
                      </TableCell>
                    </TableRow>
                  ) : (
                    submissions?.map((submission) => (
                      <TableRow
                        key={submission.id}
                        className="border-border/50"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage
                                src={submission.user.avatar?.downloadUrl}
                                alt={submission.user.name}
                              />
                              <AvatarFallback>
                                {getInitials(submission.user.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <span className="font-medium text-sm">
                                {submission.user.name}
                              </span>
                              <span className="text-xs text-muted-foreground block">
                                {submission.user.email}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              statusConfig[
                                ESubmissionStatus[
                                  submission.status
                                ] as keyof typeof statusConfig
                              ].className
                            }
                          >
                            {
                              statusConfig[
                                ESubmissionStatus[
                                  submission.status
                                ] as keyof typeof statusConfig
                              ].label
                            }
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {submission.submittedAt
                            ? format(
                                new Date(submission.submittedAt),
                                "dd/MM/yy, HH:mm'h'",
                                { locale: ptBR }
                              )
                            : "Não enviado"}
                        </TableCell>
                        <TableCell>
                          {submission.grade ? (
                            <div className="flex flex-col">
                              <span className="font-medium text-sm text-green-600">
                                {submission.grade.value.toFixed(1)} / 10
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              Não avaliado
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <FileText className="h-3 w-3" />
                            <span>{submission.archives.length} arquivo(s)</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleViewDetails(submission)}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Ver detalhes</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Componente Dialog para exibir o modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>

              {selectedSubmission?.grade
                ? "Detalhes do Envio de: "
                : "Avaliar Envio de: "}
              {selectedSubmission?.user.name}
            </DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <ActionsSubmission
              submission={selectedSubmission}
              onSuccess={handleSuccessAndCloseModal}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

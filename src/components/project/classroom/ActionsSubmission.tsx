// ActionsSubmission.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Download, FileText, GraduationCap, PackageX } from "lucide-react";
import { toast } from "sonner";


import { Submission } from "@/types/Submission/Submission";
import { Archive } from "@/types/Archive/Archive";
import GradeSubmissionForm from "../forms/GradeSubmissionForm";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

interface SubmissionActionsProps {
  submission: Submission;
  onSuccess: () => void;
}

// Função para formatar o tamanho do arquivo
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export default function ActionsSubmission({ submission, onSuccess }: SubmissionActionsProps) {
  const archives = submission.archives || [];
   const isGraded = !!submission.grade;
  async function handleDownload(archive: Archive) {
    try {
      const link = document.createElement("a");
      link.href = archive.downloadUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.setAttribute("download", archive.originalName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.info(`Iniciando o download de "${archive.originalName}"...`);
    } catch (error) {
      console.error("Erro ao tentar baixar o arquivo:", error);
      toast.error("Não foi possível iniciar o download.");
    }
  }

  return (
    <Tabs defaultValue="evaluate" className="w-full">
      {/* 1. Seletores das Abas */}
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="files">Arquivos Enviados</TabsTrigger>
        <TabsTrigger value="evaluate">Avaliar</TabsTrigger>
      </TabsList>

      {/* 2. Conteúdo da Aba de Arquivos */}
      <TabsContent value="files">
        <div className="mt-4 space-y-3">
          {archives.length > 0 ? (
            archives.map((archive) => (
              <div
                key={archive.id}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 flex-shrink-0 text-primary" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {archive.originalName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatFileSize(archive.sizeInBytes)}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(archive)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Baixar
                </Button>
              </div>
            ))
          ) : (
            // Mensagem para caso não haja arquivos
            <div className="flex flex-col items-center justify-center rounded-md border border-dashed py-10 text-center">
              <PackageX className="h-10 w-10 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Nenhum arquivo foi anexado a este envio.
              </p>
            </div>
          )}
        </div>
      </TabsContent>

      {/* 3. Conteúdo da Aba de Avaliação */}
       <TabsContent value="evaluate">
        <div className="mt-4">
          {/* 4. Mostrar a nota existente OU o formulário de avaliação */}
          {isGraded && submission.grade ? (
            <div className="rounded-md border border-green-200 bg-green-50 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-green-700" />
                <h3 className="font-semibold text-green-800">Atividade Avaliada</h3>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium">Nota:</span>
                <span className="text-2xl font-bold text-green-700">{submission.grade.value.toFixed(1)} / 10</span>
              </div>
              <div>
                <span className="text-sm font-medium">Feedback:</span>
                <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{submission.grade.feedback}</p>
              </div>
              <p className="text-xs text-gray-500 pt-2 border-t border-green-200">
                Avaliado em: {format(new Date(submission.grade.gradedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </p>
            </div>
          ) : (
            <GradeSubmissionForm submission={submission} onSuccess={onSuccess} />
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
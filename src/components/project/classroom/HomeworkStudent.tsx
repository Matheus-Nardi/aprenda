"use client"

import type React from "react"

import { useState, useRef } from "react"
import type { Homework } from "@/types/Post/Homework"
import type { User } from "@/types/User/User"
import type { Submission } from "@/types/Submission/Submission"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, FileText, Upload, X, CheckCircle, AlertCircle, Download, Paperclip } from "lucide-react"
import { ESubmissionStatus } from "@/types/Submission/ESubmissionStatus"
import { toast } from "sonner"
import { ArchiveService } from "@/lib/services/ArchiveService"
import { StudentService } from "@/lib/services/StudentService"

interface HomeworkStudentProps {
  homework: Homework
  user: User | null
  submissions?: Submission[] | null
  onSuccess?: () => void    
}

export default function HomeworkStudent({ homework, user, submissions, onSuccess }: HomeworkStudentProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)


  const dueDate = homework.dueDate ? new Date(homework.dueDate) : new Date()
  const now = new Date()
  const hasSubmissions = submissions && submissions.length > 0
  const isOverdue = dueDate < now && !hasSubmissions
  const isToday = dueDate.toDateString() === now.toDateString()

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    setSelectedFiles((prev) => [...prev, ...files])
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setSelectedFiles((prev) => [...prev, ...files])
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

 
   async function handleSubmit() {
     if (selectedFiles.length === 0) return
     
      try {
        let attachmentIds: number[] = [];
        if (selectedFiles.length > 0) {
          toast.info("Enviando anexos...");

          const uploadPromises = selectedFiles.map(file =>
              ArchiveService.uploadFile(file)
          );
          const uploadResults = await Promise.all(uploadPromises);
          attachmentIds = uploadResults.map(result => result.id);
        }
  
        const homeworkPayload = {
          AttachmentIds: attachmentIds
        };

        await StudentService.sendSubmission(homework.id, homeworkPayload);

        toast.success(`Atividade enviada com sucesso!`);
        onSuccess?.();
        setSelectedFiles([]);

      } catch (error) {
        console.error("Erro ao enviar a atividade:", error);
        toast.error("Erro ao enviar a atividade. Tente novamente.");
      }
    }

  const getStatusBadge = () => {
    if (hasSubmissions) {
      // Assuming the first submission is the latest one
      switch (submissions[0].status) {
        case ESubmissionStatus.GRADED:
          return (
            <Badge className="bg-accent/10 text-accent border-accent/20">
              <CheckCircle className="h-3 w-3 mr-1" />
              Avaliado
            </Badge>
          )
        case ESubmissionStatus.SUBMITTED:
          return (
            <Badge className="bg-secondary/10 text-secondary border-secondary/20">
              <CheckCircle className="h-3 w-3 mr-1" />
              Entregue
            </Badge>
          )
        default:
          return null
      }
    }

    if (isOverdue) {
      return (
        <Badge variant="destructive">
          <AlertCircle className="h-3 w-3 mr-1" />
          Atrasado
        </Badge>
      )
    }

    if (isToday) {
      return (
        <Badge className="bg-amber-50 text-amber-700 border-amber-200">
          <Clock className="h-3 w-3 mr-1" />
          Vence Hoje
        </Badge>
      )
    }

    return (
      <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">
        Pendente
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-border/40 bg-white">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <CardTitle className="text-2xl font-bold text-foreground">{homework.title}</CardTitle>
                {getStatusBadge()}
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={homework.user.avatar?.downloadUrl || "/placeholder.svg"}
                      alt={homework.user.name}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {homework.user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <span>{homework.user.name}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>Publicado em {formatDate(new Date(homework.createdAt))}</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="prose prose-sm max-w-none">
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">{homework.content}</p>
          </div>

          {/* Due Date */}
          <div
            className={`flex items-center gap-2 p-3 rounded-lg border ${
              isOverdue
                ? "bg-destructive/5 border-destructive/20"
                : isToday
                  ? "bg-amber-50 border-amber-200"
                  : "bg-primary/5 border-primary/20"
            }`}
          >
            <Clock
              className={`h-4 w-4 ${isOverdue ? "text-destructive" : isToday ? "text-amber-700" : "text-primary"}`}
            />
            <span
              className={`text-sm font-medium ${isOverdue ? "text-destructive" : isToday ? "text-amber-700" : "text-primary"}`}
            >
              Prazo de entrega: {formatDate(dueDate)}
            </span>
          </div>

          {/* Teacher's Attachments */}
          {homework.archives && homework.archives.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                <Paperclip className="h-4 w-4" />
                Material do Professor
              </h4>
              <div className="space-y-2">
                {homework.archives.map((archive, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-muted/30"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="text-sm text-foreground">{archive.originalName}</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submission Section */}
      {hasSubmissions ? (
        <Card className="border-border/40 bg-white">
          <CardHeader>
            <CardTitle className="text-lg">Seus Envios</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {submissions.map((submission, index) => (
              <div key={submission.id} className="p-4 rounded-lg border border-border/40 bg-muted/20 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-foreground">
                    {index === 0 ? "Último Envio" : `Envio Anterior #${submissions.length - index}`}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span>Entregue em {formatDate(new Date(submission.submittedAt))}</span>
                  </div>
                </div>

                {submission.archives && submission.archives.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-foreground">Arquivos Enviados</h4>
                    <div className="space-y-2">
                      {submission.archives.map((archive) => (
                        <div
                          key={archive.id}
                          className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-white"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-primary" />
                            <div>
                              <p className="text-sm text-foreground">{archive.originalName}</p>
                              <p className="text-xs text-muted-foreground">{formatFileSize(archive.sizeInBytes)}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {submission.grade && (
                  <div className="p-4 rounded-lg border border-accent/20 bg-accent/5">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-foreground">Avaliação</h4>
                      <Badge className="bg-accent text-white">Nota: {submission.grade.value}</Badge>
                    </div>
                    {submission.grade.feedback && (
                      <p className="text-sm text-muted-foreground">{submission.grade.feedback}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      Avaliado em {formatDate(new Date(submission.grade.gradedAt))}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/40 bg-white">
          <CardHeader>
            <CardTitle className="text-lg">Enviar Trabalho</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Drag and Drop Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                transition-all duration-200
                ${
                  isDragging
                    ? "border-primary bg-primary/5 scale-[1.02]"
                    : "border-border/40 bg-muted/20 hover:border-primary/50 hover:bg-primary/5"
                }
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                disabled={isOverdue}
              />

              <div className="flex flex-col items-center gap-3">
                <div className={`p-4 rounded-full ${isDragging ? "bg-primary/10" : "bg-primary/5"} transition-colors`}>
                  <Upload className={`h-8 w-8 ${isDragging ? "text-primary" : "text-primary/70"}`} />
                </div>

                <div>
                  <p className="text-base font-medium text-foreground mb-1">
                    {isDragging ? "Solte os arquivos aqui" : "Clique ou arraste arquivos"}
                  </p>
                  <p className="text-sm text-muted-foreground">Suporta PDF, DOC, DOCX, imagens e outros formatos</p>
                </div>
              </div>
            </div>

            {/* Selected Files */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">Arquivos Selecionados ({selectedFiles.length})</h4>
                <div className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-white"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeFile(index)
                        }}
                        className="flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-4 border-t border-border/40">
              <p className="text-sm text-muted-foreground">
                {selectedFiles.length > 0
                  ? `${selectedFiles.length} arquivo${selectedFiles.length > 1 ? "s" : ""} pronto${selectedFiles.length > 1 ? "s" : ""} para envio`
                  : "Nenhum arquivo selecionado"}
              </p>
              <Button onClick={handleSubmit} disabled={selectedFiles.length === 0 || isSubmitting || isOverdue}>
                {isSubmitting ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Enviar Trabalho
                  </>
                )}
              </Button>
            </div>

            {isOverdue && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <p className="text-sm text-destructive">O prazo de entrega expirou</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

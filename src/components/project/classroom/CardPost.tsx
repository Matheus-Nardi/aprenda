import type { Post } from "@/types/Post/Post";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Heart, Calendar, Paperclip, FileImage, FileText, FileAudio, FileArchive, File } from "lucide-react";
import { EProfile } from "@/types/User/EProfile";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

interface CardPostProps {
  post: Post;
}

export default function CardPost({ post }: CardPostProps) {
  const createdDate = new Date(post.createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const timeAgo = new Date(post.createdAt).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const getRoleBadgeColor = (role: EProfile) => {
    switch (role) {
      case 2:
        return "bg-primary/10 text-primary border-primary/20";
      case 1:
        return "bg-accent/10 text-accent-foreground border-accent/20";
      default:
        return "bg-secondary/10 text-secondary-foreground border-secondary/20";
    }
  };

  const getRoleLabel = (role: EProfile) => {
    switch (role) {
      case 2:
        return "Professor";
      case 1:
        return "Admin";
      default:
        return "Aluno";
    }
  };

  function getFileIcon(contentType: string = "") {
    if (contentType.startsWith("image/"))
      return <FileImage className="h-8 w-8 text-primary" />;
    if (contentType === "application/pdf")
      return <FileText className="h-8 w-8 text-red-500" />;
    if (contentType.startsWith("audio/"))
      return <FileAudio className="h-8 w-8 text-orange-500" />;
    if (contentType.includes("zip") || contentType.includes("rar")) {
      return <FileArchive className="h-8 w-8 text-yellow-500" />;
    }
    return <File className="h-8 w-8 text-muted-foreground" />;
  }

  function formatBytes(bytes: number = 0, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  return (
    <Card className="hover:border-primary/50 transition-all duration-200 bg-white border-border/40">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage
              src={post.user.avatar?.storedName || "/placeholder.svg"}
              alt={post.user.name}
            />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {post.user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground text-sm truncate">
                {post.user.name}
              </h3>
              <Badge
                variant="outline"
                className={`text-xs px-2 py-0.5 ${getRoleBadgeColor(
                  post.user.profile
                )}`}
              >
                {getRoleLabel(post.user.profile)}
              </Badge>
            </div>

               <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>
                {post.createdAt
                  ? format(
                      new Date(post.createdAt),
                      "dd 'de' MMMM 'de' yyyy, HH:mm'h'",
                      { locale: ptBR }
                    )
                  : "Data indisponível"}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        <div>
          <h4 className="font-semibold text-foreground mb-2 text-base leading-tight">
            {post.title}
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {post.content}
          </p>
        </div>

        {post.archives && post.archives.length > 0 && (
          <div className="mt-4 space-y-3">
            {/* Cabeçalho da seção de anexos */}
            <div className="flex items-center gap-2 border-b pb-2">
              <Paperclip className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">
                {post.archives.length}{" "}
                {post.archives.length === 1 ? "Anexo" : "Anexos"}
              </h3>
            </div>

            {/* Lista de anexos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {post.archives.map((file, idx) => {
                const isImage = file.contentType?.startsWith("image/");

                return (
                  <a
                    key={idx}
                    href={file.downloadUrl} // Supondo que storedName seja a URL
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    {isImage ? (
                      // Card para imagens com preview
                      <div className="relative w-full h-32 border rounded-lg flex items-center justify-center overflow-hidden bg-white shadow-sm transition-all group-hover:shadow-md group-hover:border-primary/50">
                        <img
                          src={file.downloadUrl}
                          alt={file.originalName}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1.5 truncate">
                          {file.originalName}
                        </div>
                      </div>
                    ) : (
                      // Card para outros tipos de arquivo
                      <div className="w-full h-32 border rounded-lg flex flex-col items-center justify-center p-2 bg-muted/30 transition-all group-hover:bg-muted/60 group-hover:border-primary/50">
                        {getFileIcon(file.contentType)}
                        <span className="text-sm font-medium mt-2 text-center truncate max-w-full px-2">
                          {file.originalName}
                        </span>
                        <span className="text-xs text-muted-foreground mt-1">
                          {formatBytes(file.sizeInBytes)}
                        </span>
                      </div>
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

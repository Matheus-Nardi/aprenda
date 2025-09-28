import type { Post } from "@/types/Post/Post"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Heart, Calendar, Paperclip } from "lucide-react"
import { EProfile } from "@/types/User/EProfile"

interface CardPostProps {
  post: Post
}

export default function CardPost({ post }: CardPostProps) {
  const createdDate = new Date(post.createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })

  const timeAgo = new Date(post.createdAt).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })

  const getRoleBadgeColor = (role: EProfile) => {
    switch (role) {
      case 2:
        return "bg-primary/10 text-primary border-primary/20"
      case 1:
        return "bg-accent/10 text-accent-foreground border-accent/20"
      default:
        return "bg-secondary/10 text-secondary-foreground border-secondary/20"
    }
  }

  const getRoleLabel = (role: EProfile) => {
    switch (role) {
      case 2:
        return "Professor"
      case 1:
        return "Admin"
      default:
        return "Aluno"
    }
  }

  return (
    <Card className="hover:border-primary/50 transition-all duration-200 bg-white border-border/40">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage src={post.user.avatar?.storedName || "/placeholder.svg"} alt={post.user.name} />
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
              <h3 className="font-semibold text-foreground text-sm truncate">{post.user.name}</h3>
              <Badge variant="outline" className={`text-xs px-2 py-0.5 ${getRoleBadgeColor(post.user.profile)}`}>
                {getRoleLabel(post.user.profile)}
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>
                {createdDate} às {timeAgo}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        <div>
          <h4 className="font-semibold text-foreground mb-2 text-base leading-tight">{post.title}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{post.content}</p>
        </div>

        {post.archives && post.archives.length > 0 && (
          <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-md">
            <Paperclip className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {post.archives.length} {post.archives.length === 1 ? "anexo" : "anexos"}
            </span>
          </div>
        )}

      </CardContent>
    </Card>
  )
}

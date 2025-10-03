import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight, BookCheck, MessageSquare, Users } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="container mx-auto flex h-16 items-center justify-between px-4">
        <h1 className="text-2xl font-bold">
          Aprenda<span className="text-primary">@</span>
        </h1>
        <Link href={'/login'}>
        <Button variant="ghost">Acessar</Button>
        </Link>
      </header>

      <main className="flex-1">
        {/* Seção Principal (Hero) */}
        <section className="container mx-auto flex flex-col items-center justify-center px-4 py-20 text-center md:py-32">
          <h2 className="text-4xl font-bold tracking-tight md:text-6xl">
            Onde o conhecimento encontra a{" "}
            <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              colaboração
            </span>
            .
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            A plataforma Aprenda@ conecta professores e alunos em um ambiente
            de aprendizado dinâmico, simplificando a gestão de atividades e a
            comunicação.
          </p>
          <Button size="lg" className="mt-8">
            <Link href={'/login'}>
            Começar Agora
            </Link>
          </Button>
        </section>

        {/* Seção de Recursos */}
        <section id="features" className="bg-muted/50 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h3 className="text-3xl font-bold">Recursos Principais</h3>
              <p className="mt-2 text-muted-foreground">
                Tudo que você precisa para uma experiência de ensino e
                aprendizado completa.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <Card>
                <CardHeader className="items-center">
                  <div className="mb-4 rounded-full bg-primary/10 p-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Salas de Aula Interativas</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  Crie e gerencie turmas, compartilhe materiais e promova
                  discussões em um só lugar.
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="items-center">
                  <div className="mb-4 rounded-full bg-primary/10 p-4">
                    <BookCheck className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Gestão de Atividades</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  Envie tarefas, defina prazos e acompanhe o progresso dos
                  alunos de forma intuitiva.
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="items-center">
                  <div className="mb-4 rounded-full bg-primary/10 p-4">
                    <MessageSquare className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Feedback Construtivo</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  Avalie os trabalhos e forneça feedbacks detalhados para
                  impulsionar o aprendizado.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Seção de Depoimentos */}
        <section id="testimonials" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h3 className="text-3xl font-bold">O que dizem nossos usuários</h3>
              <p className="mt-2 text-muted-foreground">
                A confiança de educadores e estudantes é o nosso maior incentivo.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <Card className="flex flex-col justify-between">
                <CardContent className="pt-6">
                  <p className="italic">
                    "Finalmente uma plataforma para superar o Educ@. O toque de Google
                    Classroom também foi essencial. Meus alunos podem acompanhar minhas aulas tranquilamente e receber feecback necessário"
                  </p>
                </CardContent>
                <div className="flex items-center gap-4 p-6 pt-0">
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>AC</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">Professor Itamar</p>
                    <p className="text-sm text-muted-foreground">
                       UNITINS
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="flex flex-col justify-between">
                <CardContent className="pt-6">
                  <p className="italic">
                    "Impressionado com a qualidade desse novo software edcuacional. Nem diria que foi feito em uma semana.
                    Agora posso ficar atento aos avisos e atividades dos meus professores"
                  </p>
                </CardContent>
                <div className="flex items-center gap-4 p-6 pt-0">
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>LG</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">Matheus</p>
                    <p className="text-sm text-muted-foreground">
                      Estudante de SI
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
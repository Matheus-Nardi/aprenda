export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container max-w-screen-2xl px-4 py-8 ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center justify-items-center">
          {/* Brand */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">
              Aprend<span className="text-primary">@</span>
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Plataforma educacional para comunicação acadêmica centralizada entre professores e alunos.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Recursos</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Mural da Turma
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Entrega de Trabalhos
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Biblioteca de Materiais
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Suporte</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Central de Ajuda
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Contato
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Política de Privacidade
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border/40">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <p className="text-xs text-muted-foreground">© 2025 Aprend@. Todos os direitos reservados.</p>
            <p className="text-xs text-muted-foreground">Versão 1.0.0</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

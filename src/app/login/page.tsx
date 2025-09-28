import { LoginForm } from "@/components/project/auth/LoginForm"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col items-center text-center space-y-8">
        
        {/* Logo + descrição */}
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">A</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Aprend@</h1>
          </div>
          <p className="text-lg text-gray-600">
            Conecte-se ao futuro da educação. Uma plataforma completa para professores e alunos colaborarem de forma
            eficiente.
          </p>
        </div>

        {/* Formulário centralizado abaixo */}
        <LoginForm />
      </div>
    </div>
  )
}

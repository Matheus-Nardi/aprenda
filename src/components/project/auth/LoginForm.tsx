"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { useRouter } from "next/dist/client/components/navigation"
import { useAuth } from "@/hooks/useAuth"

export function LoginForm() {
   const [showPassword, setShowPassword] = useState(false)
   const router = useRouter();
  const { login } = useAuth();
  const formSchema = z
    .object({
      email: z.string(),
      password: z.string(),
    })


  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { ...dadosParaApi } = values
    console.log(dadosParaApi)
    try {
      const user = dadosParaApi
      await login(user)
      form.reset();
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      toast.error("Erro ao fazer login. Tente novamente.")
    }
  }

  return (
    <Form {...form}>
      <form  onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">


        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Bem-vindo de volta!</h1>
            <p className="text-muted-foreground">
              Seja bem-vindo de volta, insira as suas credenciais para te conectarmos de volta.
            </p>
          </div>

        </div>

          {/* Form */}
              {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-foreground">E-mail</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="hello@example.cl"
                          type="text"
                          className="h-12 border-border focus:border-primary transition-colors"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
        
                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-foreground">Senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="••••••••••••"
                            type={showPassword ? "text" : "password"}
                            className="h-12 pr-12 border-border focus:border-primary transition-colors"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
            >
              Logar
            </Button>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Não tem uma conta?{" "}
              <Link href="/signup" className="text-primary hover:text-primary/80 font-medium transition-colors">
                Quero criar uma
              </Link>
            </p>
          </div>
        </form>
      </Form>

  )
}
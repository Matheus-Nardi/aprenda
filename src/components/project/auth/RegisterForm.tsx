"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { useRouter } from "next/dist/client/components/navigation";
import { useAuth } from "@/hooks/useAuth";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AuthService } from "@/lib/services/AuthService";

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  const formSchema = z
    .object({
      name: z.string().min(2, "O nome deve ter no mínimo 2 caracteres"),
      email: z.string().email("E-mail inválido"),
      password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
      confirmPassword: z
        .string()
        .min(6, "A confirmação de senha deve ter no mínimo 6 caracteres"),
      profile: z.coerce.number().min(1).max(3),
      avatarId: z.int().nullable(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "As senhas não coincidem!",
      path: ["confirmPassword"],
    });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      profile: 3,
      avatarId: null,
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { confirmPassword, ...dadosParaApi } = values;
    console.log(dadosParaApi);
    try {
      const user = dadosParaApi;
      await AuthService.register(user);
      await login({ email: user.email, password: user.password });
      form.reset();
    } catch (error) {
      console.error("Erro ao realizar cadastro:", error);
      toast.error("Erro ao realizar cadastro. Tente novamente.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
             Registre-se agora
            </h1>
            <p className="text-muted-foreground">
              Crie sua conta para começar a usar nossa plataforma.
            </p>
          </div>
        </div>

        {/* Form */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-foreground">
                E-mail
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Matheus Example"
                  type="text"
                  className="h-12 border-border focus:border-primary transition-colors"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-foreground">
                E-mail
              </FormLabel>
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
              <FormLabel className="text-sm font-medium text-foreground">
                Senha
              </FormLabel>
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
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-foreground">
                Confirmar Senha
              </FormLabel>
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
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="profile"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Qual é o seu perfil?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value?.toString()} 
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="2" />
                    </FormControl>
                    <FormLabel className="font-normal">Professor</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="3" />
                    </FormControl>
                    <FormLabel className="font-normal">Aluno</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" size="lg">
          Registar
        </Button>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <Link
              href="/login"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Entrar
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
}

"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  return (
    <Card className="border-none shadow-2xl bg-card/50 backdrop-blur-sm">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-3xl font-bold tracking-tight">DevPulse</CardTitle>
        <CardDescription>
          Geliştirici verimliliğinizi takip etmek için giriş yapın
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 mt-4">
        <Button
          variant="default"
          className="w-full h-12 text-lg font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
          onClick={() => signIn("github", { callbackUrl: "/" })}
        >
          <LogIn className="mr-2 h-5 w-5" />
          DevPulse&apos;a GitHub ile Devam Et
        </Button>
      </CardContent>
      <CardFooter>
        <p className="text-center text-xs text-muted-foreground w-full">
          Giriş yaparak kullanım koşullarımızı kabul etmiş olursunuz.
        </p>
      </CardFooter>
    </Card>
  );
}

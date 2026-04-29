"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background text-foreground gap-4">
      <h1 className="text-4xl font-bold tracking-tight">DevPulse</h1>
      
      {status === "loading" ? (
        <p className="text-muted-foreground animate-pulse">Oturum kontrol ediliyor...</p>
      ) : session ? (
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-card border shadow-sm">
            {session.user?.image && (
              <Image 
                src={session.user.image} 
                alt={session.user.name || ""} 
                width={40}
                height={40}
                className="rounded-full"
              />
            )}
            <div>
              <p className="font-medium">{session.user?.name}</p>
              <p className="text-xs text-muted-foreground">{session.user?.email}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Link href="/dashboard">
              <Button variant="default">
                Dashboard'a Git
              </Button>
            </Link>
            <Button variant="outline" onClick={() => signOut()}>
              Çıkış Yap
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-muted-foreground max-w-sm">
            GitHub aktivitelerinizi analiz etmek ve verimlilik skorunuzu görmek için giriş yapın.
          </p>
          <Link href="/login">
            <Button variant="default" size="lg">
              Giriş Yap
            </Button>
          </Link>
        </div>
      )}
    </main>
  );
}

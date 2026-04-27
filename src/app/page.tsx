import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background text-foreground gap-4">
      <h1 className="text-4xl font-bold tracking-tight">DevPulse Web</h1>
      <p className="text-muted-foreground">Frontend base application is running.</p>
      
      <div className="flex gap-4 mt-8">
        <Button variant="default">Default Button</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="destructive">Destructive</Button>
      </div>
    </main>
  );
}

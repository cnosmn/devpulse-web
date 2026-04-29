export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Hoş Geldiniz!</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Aktif Projeler</p>
          <p className="text-2xl font-bold">12</p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Toplam Commit</p>
          <p className="text-2xl font-bold">1,284</p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Haftalık Skor</p>
          <p className="text-2xl font-bold text-green-500">%84</p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Aktif Saatler</p>
          <p className="text-2xl font-bold">34.5s</p>
        </div>
      </div>
    </div>
  );
}

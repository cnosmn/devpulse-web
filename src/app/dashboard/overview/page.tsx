"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import api from "@/lib/api-client";
import { StatCard } from "@/components/dashboard/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ActivityHeatmap } from "@/components/charts/activity-heatmap";
import { 
  Code, 
  GitCommit, 
  Zap, 
  TrendingUp 
} from "lucide-react";

interface MetricsResponse {
  success: boolean;
  data: {
    heatmap: { date: string; count: number }[];
    summary: {
      totalRepos: number;
      totalCommits: number;
    };
  };
}

interface ScoreResponse {
  success: boolean;
  data: {
    score: number;
    changePercentage: number;
    mostActiveDay: string;
  };
}

export default function OverviewPage() {
  const { data: session } = useSession();
  
  const userId = session?.user?.id;

  const { data: metrics, isLoading: isMetricsLoading } = useQuery<MetricsResponse>({
    queryKey: ["metrics", userId],
    queryFn: async () => {
      const res = await api.get(`/metrics/overview?userId=${userId}`);
      return res.data;
    },
    enabled: !!userId,
  });

  const { data: score, isLoading: isScoreLoading } = useQuery<ScoreResponse>({
    queryKey: ["score", userId],
    queryFn: async () => {
      const res = await api.get(`/metrics/score?userId=${userId}`);
      return res.data;
    },
    enabled: !!userId,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Genel Bakış</h1>
        <p className="text-muted-foreground">
          Geliştirici aktivitelerinizin ve üretkenlik skorunuzun özeti.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Toplam Commit"
          value={metrics?.data.summary.totalCommits}
          icon={GitCommit}
          isLoading={isMetricsLoading}
          description="Bu yılın toplam commit sayısı"
        />
        <StatCard
          title="Aktif Repolar"
          value={metrics?.data.summary.totalRepos}
          icon={Code}
          isLoading={isMetricsLoading}
          description="Bağlı GitHub depoları"
        />
        <StatCard
          title="Üretkenlik Skoru"
          value={score?.data.score}
          icon={Zap}
          isLoading={isScoreLoading}
          trend={{
            value: score?.data.changePercentage || 0,
            label: "geçen haftaya göre",
          }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <ActivityHeatmap 
          data={metrics?.data.heatmap} 
          isLoading={isMetricsLoading} 
        />
        <Card className="col-span-3 p-6 border-none bg-card/50 backdrop-blur-xl shadow-lg">
          <h3 className="text-lg font-semibold tracking-tight mb-4">En Aktif Gün</h3>
          <div className="flex flex-col items-center justify-center h-[300px] space-y-4">
            {isScoreLoading ? (
              <Skeleton className="h-12 w-32" />
            ) : (
              <>
                <TrendingUp className="h-12 w-12 text-primary" />
                <p className="text-2xl font-bold">{score?.data.mostActiveDay}</p>
                <p className="text-sm text-muted-foreground text-center px-4">
                  Bu hafta en çok {score?.data.mostActiveDay} günü commit attınız.
                </p>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

// Card bileşeni importu eksik kalmasın diye sayfa içinde basitçe Card importu veya kullanımı
import { Card } from "@/components/ui/card";

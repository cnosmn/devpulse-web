"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import api from "@/lib/api-client";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";
import { BarChart3, Clock, Globe, PieChart as PieChartIcon, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Custom Tooltip Component for better readability
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 backdrop-blur-md border border-border p-3 rounded-xl shadow-2xl">
        <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">{label}</p>
        <div className="flex items-center gap-2">
          <div 
            className="h-2 w-2 rounded-full" 
            style={{ backgroundColor: payload[0].color || payload[0].fill }} 
          />
          <p className="text-sm font-semibold text-foreground">
            {payload[0].value} Aktivite
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { data: analyticsResponse, isLoading } = useQuery({
    queryKey: ["analytics", userId],
    queryFn: async () => {
      const res = await api.get(`/analytics?userId=${userId}`);
      return res.data;
    },
    enabled: !!userId,
  });

  const analytics = analyticsResponse?.data;

  if (isLoading) {
    return (
      <div className="space-y-8 pb-12">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[350px] rounded-xl" />
          <Skeleton className="h-[350px] rounded-xl" />
        </div>
        <Skeleton className="h-[400px] rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Analizler</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Çalışma alışkanlıklarınız ve projelerinizin detaylı istatistikleri.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Hourly Activity */}
        <div className="rounded-2xl border bg-card/40 backdrop-blur-xl p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-500/10 rounded-md">
                <Clock className="h-4 w-4 text-blue-500" />
              </div>
              <h3 className="font-bold tracking-tight">Saatlik Aktivite</h3>
            </div>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.hourlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" opacity={0.4} />
                <XAxis 
                  dataKey="hour" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  interval={3}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis fontSize={10} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))', opacity: 0.1 }} />
                <Bar 
                  dataKey="count" 
                  fill="url(#barGradient)" 
                  radius={[4, 4, 0, 0]} 
                  barSize={12} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Language Distribution */}
        <div className="rounded-2xl border bg-card/40 backdrop-blur-xl p-6 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-purple-500/10 rounded-md">
                <Globe className="h-4 w-4 text-purple-500" />
              </div>
              <h3 className="font-bold tracking-tight">Dil Dağılımı</h3>
            </div>
          </div>
          <div className="h-[280px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics?.languageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {analytics?.languageData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">En Çok</span>
              <span className="text-lg font-black tracking-tight">{analytics?.languageData[0]?.name || "N/A"}</span>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
            {analytics?.languageData.slice(0, 4).map((lang: any, index: number) => (
              <div key={index} className="flex items-center gap-2 px-2 py-1 bg-muted/30 rounded-full border border-border/50">
                <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: lang.color }} />
                <span className="text-[10px] font-bold text-foreground/80">{lang.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Activity Trends */}
      <div className="rounded-2xl border bg-card/40 backdrop-blur-xl p-6 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-green-500/10 rounded-md">
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <h3 className="font-bold tracking-tight">Haftalık Performans Trendi</h3>
          </div>
        </div>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics?.dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" opacity={0.4} />
              <XAxis 
                dataKey="day" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                stroke="hsl(var(--muted-foreground))"
                dy={10}
              />
              <YAxis fontSize={10} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#areaGradient)"
                dot={{ r: 4, fill: "hsl(var(--background))", stroke: "hsl(var(--primary))", strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

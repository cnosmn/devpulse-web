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
  Line
} from "recharts";
import { BarChart3, Clock, Globe, PieChart as PieChartIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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
        <div className="rounded-xl border bg-card/50 backdrop-blur-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Saatlik Aktivite</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.hourlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                <XAxis 
                  dataKey="hour" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  interval={3}
                />
                <YAxis fontSize={10} tickLine={false} axisLine={false} width={30} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px"
                  }} 
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Language Distribution */}
        <div className="rounded-xl border bg-card/50 backdrop-blur-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Globe className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Dil Dağılımı</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics?.languageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {analytics?.languageData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px"
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              {analytics?.languageData.slice(0, 5).map((lang: any, index: number) => (
                <div key={index} className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: lang.color }} />
                  <span className="text-[10px] font-medium">{lang.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Activity Trends */}
      <div className="rounded-xl border bg-card/50 backdrop-blur-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <PieChartIcon className="h-4 w-4 text-primary" />
          <h3 className="font-semibold">Haftalık Performans Trendi</h3>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analytics?.dailyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
              <XAxis 
                dataKey="day" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
              />
              <YAxis fontSize={10} tickLine={false} axisLine={false} width={30} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  borderColor: "hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px"
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2} 
                dot={{ r: 4, fill: "hsl(var(--primary))" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

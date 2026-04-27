"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ActivityHeatmapProps {
  data?: { date: string; count: number }[];
  isLoading?: boolean;
}

export function ActivityHeatmap({ data, isLoading }: ActivityHeatmapProps) {
  if (isLoading) {
    return (
      <Card className="col-span-4">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  // Format data for easier reading in Tooltip if needed
  const formattedData = data?.map(item => ({
    ...item,
    formattedDate: new Date(item.date).toLocaleDateString("tr-TR", {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <Card className="col-span-4 overflow-hidden border-none bg-card/50 backdrop-blur-xl shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold tracking-tight">Aktivite Yoğunluğu</CardTitle>
        <p className="text-xs text-muted-foreground">Son 30 günlük commit aktivitesi</p>
      </CardHeader>
      <CardContent className="h-[350px] p-0 pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={formattedData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="var(--border)" 
              opacity={0.5} 
            />
            <XAxis
              dataKey="formattedDate"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
              minTickGap={30}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-3 shadow-xl backdrop-blur-md">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase text-muted-foreground font-bold">
                          {payload[0].payload.formattedDate}
                        </span>
                        <span className="text-sm font-bold text-primary">
                          {payload[0].value} Commit
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="var(--primary)"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorCount)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

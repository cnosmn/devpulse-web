"use client";

import { GitCommit, Calendar, Clock, Folder, History } from "lucide-react";
import { format, isToday, isYesterday, startOfDay } from "date-fns";
import { tr } from "date-fns/locale";

interface Activity {
  id: number;
  sha: string;
  message: string;
  date: string;
  repository: {
    name: string;
    fullName: string;
  };
}

interface ActivityTimelineProps {
  activities: Activity[];
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  if (!activities || activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-card/50 backdrop-blur-xl rounded-xl border shadow-lg">
        <History className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
        <h3 className="text-lg font-semibold tracking-tight">Henüz aktivite yok</h3>
        <p className="text-sm text-muted-foreground">
          GitHub senkronizasyonu tamamlandığında burada görünecek.
        </p>
      </div>
    );
  }

  // Group activities by date
  const groupedActivities = activities.reduce((groups: Record<string, Activity[]>, activity) => {
    const date = format(startOfDay(new Date(activity.date)), "yyyy-MM-dd");
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {});

  const getDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return "Bugün";
    if (isYesterday(date)) return "Dün";
    return format(date, "dd MMMM yyyy", { locale: tr });
  };

  return (
    <div className="space-y-12">
      {Object.entries(groupedActivities).map(([date, items]) => (
        <div key={date} className="space-y-4">
          {/* Date Header */}
          <div className="sticky top-20 z-10 flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground bg-background px-4 py-1 rounded-full border shadow-sm">
              {getDateLabel(date)}
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

          {/* Activity Cards */}
          <div className="grid gap-3">
            {items.map((activity) => (
              <div 
                key={activity.id} 
                className="group relative flex items-start gap-4 p-4 rounded-xl border bg-card/40 backdrop-blur-md hover:bg-card/60 transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-background group-hover:border-primary/50 transition-colors">
                  <GitCommit className="h-4 w-4 text-primary" />
                </div>
                
                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-primary/80 uppercase tracking-tight">
                      <Folder className="h-3 w-3" />
                      {activity.repository.name}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
                      <Clock className="h-3 w-3" />
                      {format(new Date(activity.date), "HH:mm")}
                    </div>
                  </div>
                  
                  <p className="text-sm font-medium leading-relaxed text-foreground/90 break-words">
                    {activity.message}
                  </p>
                  
                  <div className="flex items-center gap-3 pt-1">
                    <div className="text-[10px] font-mono text-muted-foreground/60 bg-muted/30 px-1.5 py-0.5 rounded">
                      {activity.sha.substring(0, 7)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

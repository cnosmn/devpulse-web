"use client";

import { GitCommit, Calendar, Clock, Folder } from "lucide-react";
import { format } from "date-fns";
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
      <div className="flex flex-col items-center justify-center p-12 text-center bg-card/50 backdrop-blur-xl rounded-xl border-none shadow-lg">
        <GitCommit className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
        <h3 className="text-lg font-semibold tracking-tight">Henüz aktivite yok</h3>
        <p className="text-sm text-muted-foreground">
          GitHub senkronizasyonu tamamlandığında burada görünecek.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
      {activities.map((activity, index) => (
        <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          {/* Icon */}
          <div className="flex items-center justify-center w-10 h-10 rounded-full border bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
            <GitCommit className="h-5 w-5 text-primary" />
          </div>
          
          {/* Content */}
          <div className="w-[calc(100%-4rem)] md:w-[45%] bg-card/50 backdrop-blur-xl p-4 rounded-xl border shadow-sm group-hover:shadow-md transition-shadow">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                  <Folder className="h-3 w-3" />
                  {activity.repository.name}
                </div>
                <time className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(activity.date), "dd MMM yyyy", { locale: tr })}
                  <Clock className="h-3 w-3 ml-1" />
                  {format(new Date(activity.date), "HH:mm")}
                </time>
              </div>
              
              <p className="text-sm font-medium leading-snug">
                {activity.message}
              </p>
              
              <div className="text-[10px] font-mono text-muted-foreground truncate opacity-50">
                SHA: {activity.sha.substring(0, 7)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

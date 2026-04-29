"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import api from "@/lib/api-client";
import { ActivityTimeline } from "@/components/dashboard/activity-timeline";
import { Skeleton } from "@/components/ui/skeleton";
import { History } from "lucide-react";

export default function ActivityPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { data: activityResponse, isLoading } = useQuery({
    queryKey: ["activities", userId],
    queryFn: async () => {
      const res = await api.get(`/activities?userId=${userId}&limit=50`);
      return res.data;
    },
    enabled: !!userId,
  });

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <History className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Aktivite Akışı</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          GitHub üzerinden çekilen son commit aktiviteleriniz.
        </p>
      </div>

      <div className="pt-4">
        {isLoading ? (
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <Skeleton className="h-24 w-full rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <ActivityTimeline activities={activityResponse?.data || []} />
        )}
      </div>
    </div>
  );
}

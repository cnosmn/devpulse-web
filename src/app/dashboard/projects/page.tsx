"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import api from "@/lib/api-client";
import { RepoList } from "@/components/dashboard/repo-list";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectsPage() {
  const { data: session } = useSession();
  
  const userId = session?.user?.id;

  const { data: projectsResponse, isLoading } = useQuery({
    queryKey: ["projects", userId],
    queryFn: async () => {
      const res = await api.get(`/projects?userId=${userId}`);
      return res.data;
    },
    enabled: !!userId,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Projelerim</h1>
        <p className="text-muted-foreground text-sm max-w-2xl">
          Bağlı olduğunuz tüm GitHub depoları ve bunların son aktivitelerine göre 
          hesaplanan üretkenlik skorları.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : (
        <RepoList projects={projectsResponse?.data || []} />
      )}
    </div>
  );
}

"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ExternalLink, GitBranch } from "lucide-react";

interface Language {
  name: string;
  color?: string;
  count?: number;
}

interface Project {
  id: number;
  name: string;
  fullName: string;
  description: string;
  url: string;
  languages: Language[] | null;
  stargazerCount: number;
  totalCommits: number;
  lastCommitAt: string | null;
  score: number;
  status: 'active' | 'idle';
}

interface RepoListProps {
  projects: Project[];
}

export function RepoList({ projects }: RepoListProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Commit yok";
    const date = new Date(dateString);
    return new Intl.RelativeTimeFormat("tr", { numeric: "auto" }).format(
      Math.ceil((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
      "day"
    );
  };

  return (
    <div className="rounded-xl border bg-card/50 backdrop-blur-xl overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-muted">
            <TableHead className="w-[300px]">Proje Adı</TableHead>
            <TableHead>Diller</TableHead>
            <TableHead>Aktivite Skoru</TableHead>
            <TableHead>Son Commit</TableHead>
            <TableHead className="text-right">Durum</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow
              key={project.id}
              className={cn(
                "transition-colors border-muted/50",
                project.status === "idle" && "opacity-60 grayscale-[0.8]"
              )}
            >
              <TableCell className="font-medium">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <GitBranch className="h-4 w-4 text-primary" />
                    <span className="text-base">{project.name}</span>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <span className="text-xs text-muted-foreground line-clamp-1 max-w-[250px]">
                    {project.description || "Açıklama yok"}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {Array.isArray(project.languages) &&
                    project.languages.slice(0, 3).map((lang) => (
                      <Badge
                        key={lang.name}
                        variant="secondary"
                        className="text-[10px] font-normal"
                        style={{ borderLeft: `3px solid ${lang.color || "#ccc"}` }}
                      >
                        {lang.name}
                      </Badge>
                    ))}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full transition-all duration-1000",
                        project.score > 70 ? "bg-green-500" : project.score > 30 ? "bg-yellow-500" : "bg-red-500"
                      )}
                      style={{ width: `${project.score}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold">{project.score}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(project.lastCommitAt)}
              </TableCell>
              <TableCell className="text-right">
                <Badge
                  variant={project.status === "active" ? "default" : "outline"}
                  className={cn(
                    "capitalize",
                    project.status === "active" ? "bg-green-100 text-green-700 hover:bg-green-100 border-none" : "bg-muted text-muted-foreground hover:bg-muted border-none"
                  )}
                >
                  {project.status === "active" ? "Aktif" : "Sakin"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

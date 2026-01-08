import { Calendar, ImageIcon, Layers } from "lucide-react";
import Image from "next/image";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import Link from "next/link";
import BadgeDrawer from "../BadgeDrawer";
import { cn } from "@/lib/utils";

// TODO: project will have type. it will be shown in place of case study. projects may have types like - case study, project, learning, fun

interface Technology {
  _id: string;
  name: string;
  icon?: string;
}

interface ProjectProps {
  project: {
    name: string;
    slug: string;
    description: string;
    thumbnail?: string;
    technologies: Technology[];
    devPhase?: {
      status?: string;
      startDate?: string;
      endDate?: string;
    };
  };
}

export default function ProjectCard({
  project,
  isNew,
}: ProjectProps & { isNew: boolean }) {
  return (
    <Card
      className={cn(
        "group transition-all duration-300 hover:-translate-y-1 outline-none",
        isNew
          ? "border-primary ring-2 ring-primary/50 shadow-primary/20 animate-pulse"
          : "border-muted/50",
      )}
    >
      {/* Project thumbnail */}
      <Link href={`/projects/${project.slug}`}>
        <div className="w-full h-56 bg-muted/50 relative overflow-hidden flex items-center justify-center group-hover:bg-muted/70 transition-colors">
          {project.thumbnail ? (
            <Image
              src={project.thumbnail}
              alt={project.name}
              fill
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/50 gap-2">
              <ImageIcon className="w-12 h-12" />
            </div>
          )}
        </div>
      </Link>

      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="bg-linear-to-r from-foreground to-foreground/70 bg-clip-text group-hover:text-primary transition-colors">
            {project.name}
          </CardTitle>

          {project.devPhase?.status && (
            <Badge variant="outline" className="text-xs shrink-0">
              {project.devPhase.status}
            </Badge>
          )}
        </div>

        <CardDescription className="line-clamp-2 min-h-10">
          {project.description}
        </CardDescription>
      </CardHeader>

      <CardFooter className="mt-auto flex-col items-start gap-4">
        {/* Technologies */}
        <div className="flex flex-wrap gap-2">
          {project.technologies?.slice(0, 3).map((tech: any) => (
            <BadgeDrawer key={tech._id} tech={tech} fromCard />
          ))}

          {project.technologies?.length > 3 && (
            <span className="text-[10px] text-muted-foreground">
              +{project.technologies.length - 3} more
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground w-full pt-2 border-t border-border/50">
          {project.devPhase?.startDate && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(project.devPhase.startDate).toLocaleDateString(
                undefined,
                {
                  month: "short",
                  year: "numeric",
                },
              )}
            </div>
          )}

          <div className="flex items-center gap-1.5 ml-auto">
            <Layers className="w-3.5 h-3.5" />
            Case Study
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

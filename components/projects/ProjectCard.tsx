import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { Card } from "../ui/card";

export default function ProjectCard({ project }) {
  console.log(project);

  return (
    <Card>
      <div className="w-full h-48 bg-muted/50 relative overflow-hidden flex items-center justify-center group-hover:bg-muted/70 transition-colors">
        {project.thumbnail ? (
          <Image
            src={project.thumbnail}
            alt={project.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground/50 gap-2">
            <ImageIcon className="w-12 h-12" />
          </div>
        )}
      </div>
    </Card>
  );
}

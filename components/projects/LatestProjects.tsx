import { getFeaturedProjects } from "@/queries/project";
import Link from "next/link";
import ProjectCard from "./ProjectCard";

export default async function LatestProjects() {
  const projects = await getFeaturedProjects(6);

  console.log("projects from leatestProject componenet: ", projects)

  return (
    <div>
      <div className="my-5 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Latest Projects</h2>

        <div className="flex items-center gap-4">
          <Link
            href={"/timeline"}
            className="text-muted-foreground hover:text-primary transition-colors text-sm"
          >
            Timeline
          </Link>

          <Link
            href={"/projects"}
            className="text-primary underline underline-offset-3 decoration-stone-400"
          >
            View all
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {projects.map((project: any) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>
    </div>
  );
}

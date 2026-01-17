import ProjectCard from "@/components/projects/ProjectCard";
import { getAllProjects } from "@/queries/project";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "All Projects | Mainuddin",
  description: "A complete list of my open source projects and experiments.",
};

// TODO: beside the heading "All Projects" have the count of the projects - public/private

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>;
}) {
  const projects = await getAllProjects();
  const { new: newSlug } = await searchParams;

  return (
    <div className="py-10 min-h-screen">
      <div className="mb-10 space-y-4">
        <Link
          href="/"
          className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          All Projects
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          A collection of {projects.length} projects including personal
          projects, experiments, and learning exercises.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project: any) => (
          <ProjectCard
            key={project._id}
            project={project}
            isNew={project.slug === newSlug}
          />
        ))}
      </div>
    </div>
  );
}

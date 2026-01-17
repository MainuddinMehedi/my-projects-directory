import ProjectForm from "@/components/projects/ProjectForm";
import { getProjectBySlug } from "@/queries/project";
import { notFound } from "next/navigation";

interface EditProjectPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  // console.log("project to edit: ", project);

  if (!project) notFound();

  return (
    <div className="container max-w-2xl py-10">
      <h1 className="text-3xl font-bold mb-8">Edit Project: {project.name}</h1>
      <ProjectForm initialData={project} />
    </div>
  );
}

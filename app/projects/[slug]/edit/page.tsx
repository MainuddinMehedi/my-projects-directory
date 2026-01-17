import ProjectForm from "@/components/projects/ProjectForm";
import { getProjectBySlug } from "@/queries/project";
import { notFound } from "next/navigation";

interface EditProjectPageProps {
  params: Promise<{ slug: string }>;
}

import { getAvailableTagsAndTechnologies } from "@/actions/project-actions";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  const { tags, technologies } = await getAvailableTagsAndTechnologies();

  // console.log("project to edit: ", project);

  if (!project) notFound();

  return (
    <div className=" flex justify-center">
      <div className="container py-10">
        <Link
          href="/"
          className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <Card className="max-w-2xl mx-auto py-10">
          <CardHeader>
            <h1 className="text-3xl font-bold mb-5">
              Edit Project:{" "}
              <span className="font-extrabold tracking-tight bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {project.pname}
              </span>
            </h1>
          </CardHeader>

          <CardContent>
            <ProjectForm
              initialData={project}
              availableTags={tags}
              availableTechnologies={technologies}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

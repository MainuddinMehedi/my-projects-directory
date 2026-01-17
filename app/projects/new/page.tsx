import ProjectForm from "@/components/projects/ProjectForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { getAvailableTagsAndTechnologies } from "@/actions/project-actions";

export default async function NewProjectPage() {
  const { tags, technologies } = await getAvailableTagsAndTechnologies();

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

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-4xl text-center font-bold mb-8">
              Add New Project
            </CardTitle>
          </CardHeader>

          <CardContent>
            <ProjectForm
              availableTags={tags}
              availableTechnologies={technologies}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

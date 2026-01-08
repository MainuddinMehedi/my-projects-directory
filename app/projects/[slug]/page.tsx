import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Github, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import BadgeDrawer from "@/components/BadgeDrawer";
import { getProjectBySlug } from "@/queries/project";
import Image from "next/image";
import ProjectActions from "@/components/projects/ProjectActions";
// import { MarkdownPreview } from "@/components/ui/markdown-preview";
// import { ProjectActions } from "@/components/projects/ProjectActions";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  return (
    <article className="min-h-screen py-10">
      {/* Header / Hero */}
      <div className="mb-8">
        <Link
          href="/projects"
          className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Link>

        {/* Intro and actions - edit, delete, git */}
        <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {project.name}
              </h1>
              {project.devPhase?.status && (
                <Badge variant="outline" className="text-sm px-3 py-1">
                  {project.devPhase.status}
                </Badge>
              )}
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl">
              {project.description}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            {project.repoLink && (
              <Button variant="outline" size="sm" asChild>
                <a
                  href={project.repoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="mr-2 h-4 w-4" /> Repo
                </a>
              </Button>
            )}
            {project.demoLink && (
              <Button size="sm" asChild>
                <a
                  href={project.demoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                </a>
              </Button>
            )}
            <ProjectActions
              projectId={project._id.toString()}
              projectSlug={project.slug}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-12">
        {/* Main Content - Left 2/3 */}
        <div className="lg:col-span-2 space-y-12">
          {/* Gallery / Main Image */}
          {/* TODO: This will be a carousel when i have multiple images. and i will probably require to add multiple image of the proejct. */}
          {project.thumbnail && (
            <div className="relative w-full h-122.5 rounded-xl overflow-hidden border border-border shadow-md">
              <Image
                src={project.thumbnail}
                alt={project.name}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Overview / Problem Statement (Markdown placeholder) */}
          {(project.overview || project.problemStatement) && (
            <div className="prose dark:prose-invert max-w-none">
              {project.overview && (
                <section>
                  <h2 className="flex items-center gap-2 text-2xl font-bold mb-4">
                    <Layers className="w-6 h-6 text-primary" />
                    Project Details
                  </h2>
                  <div className="opacity-90">
                    {/* <MarkdownPreview source={project.overview} /> */}
                  </div>
                </section>
              )}

              {/* Challenges Section */}
              {project.challenges?.length > 0 && (
                <section className="mt-12">
                  <h2>Challenges & Solutions</h2>
                  <div className="grid gap-6">
                    {project.challenges.map((challenge: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-card/50 border rounded-lg p-6"
                      >
                        <h3 className="text-lg font-bold mb-2 text-red-400">
                          Problem: {challenge.title}
                        </h3>
                        <p className="mb-4 text-muted-foreground">
                          {challenge.description}
                        </p>
                        <div className="pl-4 border-l-2 border-green-500/50">
                          <h4 className="font-semibold text-green-400 text-sm mb-1">
                            Solution
                          </h4>
                          <p>{challenge.solution}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>

        {/* Sidebar - Right 1/3 */}
        <div className="space-y-8">
          {/* Tech Stack */}
          <div className="bg-card/30 rounded-xl p-6 border">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              Technologies
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies?.map((tech: any) => (
                <BadgeDrawer key={tech._id} tech={tech} />
              ))}
            </div>
          </div>

          {/* Tags */}
          {project.tags?.length > 0 && (
            <div className="bg-card/30 rounded-xl p-6 border">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag: any) => (
                  <Badge key={tag._id} variant="secondary">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Dev Phase Info */}
          <div className="bg-card/30 rounded-xl p-6 border">
            <h3 className="font-semibold mb-4">Development Phase</h3>
            <div className="space-y-3 text-sm">
              {project.devPhase?.startDate && (
                <div className="flex justify-between items-center pb-2 border-b border-border/50">
                  <span className="text-muted-foreground">Started</span>
                  <span className="font-medium">
                    {new Date(project.devPhase.startDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              {project.devPhase?.endDate && (
                <div className="flex justify-between items-center pb-2 border-b border-border/50">
                  <span className="text-muted-foreground">Completed</span>
                  <span className="font-medium">
                    {new Date(project.devPhase.endDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Config Snippets */}
          {project.relatedConfigs?.length > 0 && (
            <div className="bg-card/30 rounded-xl p-6 border">
              <h3 className="font-semibold mb-4">Saved Configs</h3>
              <div className="space-y-4">
                {project.relatedConfigs.map((config: any, i: number) => (
                  <div key={i}>
                    <div className="text-xs font-medium mb-1 text-muted-foreground">
                      {config.title}
                    </div>
                    <pre className="bg-zinc-950 p-3 rounded-md text-xs overflow-x-auto border border-white/10">
                      <code>{config.codeSnippet}</code>
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

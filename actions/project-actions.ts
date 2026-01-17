"use server";

import { Project, Tag, Technology } from "@/models";
import { dbConnect } from "@/service/mongo";
import { prepareProjectData } from "@/services/project-service";
import { generateSlug } from "@/utils/generateSlug";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Zod Schema (Duplicated from client for server-side validation)
const projectSchema = z.object({
  pname: z.string().min(1, { message: "Project name is required" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(500, { message: "Description must be within 500 characters." }),
  thumbnail: z.string().url({ message: "Please enter a valid url" }),
  gallery: z.string().optional(),
  repoLink: z
    .string()
    .url({ message: "Please enter a valid url" })
    .optional()
    .or(z.literal("")),
  siteUrl: z.string().optional(),
  technologies: z.string().min(1, { message: "Please list technologies used" }),
  tags: z.string().optional(),
  details: z.string().optional(),
  problemStatement: z.string().optional(),
  devStatus: z.enum([
    "Planned",
    "In Progress",
    "Completed",
    "On Hold",
    "Abandoned",
  ]),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type ActionState = {
  success?: boolean;
  message?: string;
  errors?: { [key: string]: string[] } | string;
  projectSlug?: string;
};

export async function createProjectAction(
  prevState: ActionState | null, // Not used strictly if we use the RPC style, but good for proper form actions
  data: z.infer<typeof projectSchema> // We will call this as an RPC for now based on the plan's recommendation
): Promise<ActionState> {
  try {
    // TODO: Implement Auth Check
    // if (!session) throw new Error("Unauthorized");

    await dbConnect();

    // Validate input
    const validatedFields = projectSchema.safeParse(data);
    if (!validatedFields.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const slug = generateSlug(validatedFields.data.pname);
    // Potential slug collision check could go here

    const payload = await prepareProjectData({ ...validatedFields.data, slug });

    // Create Project
    const newProject = await Project.create(payload);

    revalidatePath("/projects");
    return {
      success: true,
      message: "Project created successfully!",
      projectSlug: newProject.slug,
    };
  } catch (error: any) {
    console.error("Error in createProjectAction:", error);
    return {
      success: false,
      message: error.message || "Failed to create project",
    };
  }
}

export async function updateProjectAction(
  id: string,
  data: z.infer<typeof projectSchema>
): Promise<ActionState> {
  try {
    // TODO: Implement Auth Check

    await dbConnect();

    const validatedFields = projectSchema.safeParse(data);
    if (!validatedFields.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const slug = generateSlug(validatedFields.data.pname);

    const payload = await prepareProjectData({ ...validatedFields.data, slug });

    const updatedProject = await Project.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    if (!updatedProject) {
      return { success: false, message: "Project not found" };
    }

    revalidatePath("/projects");
    revalidatePath(`/projects/${updatedProject.slug}`);

    return {
      success: true,
      message: "Project updated successfully!",
      projectSlug: updatedProject.slug,
    };
  } catch (error: any) {
    console.error("Error in updateProjectAction:", error);
    return {
      success: false,
      message: error.message || "Failed to update project",
    };
  }
}

export async function getAvailableTagsAndTechnologies() {
  try {
    await dbConnect();
    const technologies = await Technology.find({})
      .sort({ name: 1 })
      .select("name");
    const tags = await Tag.find({}).sort({ name: 1 }).select("name");

    return {
      technologies: technologies.map((t) => t.name),
      tags: tags.map((t) => t.name),
    };
  } catch (error) {
    console.error("Error fetching tags/techs:", error);
    return { technologies: [], tags: [] };
  }
}

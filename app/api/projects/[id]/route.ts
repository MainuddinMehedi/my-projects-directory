import { Project, Tag, Technology } from "@/models";
import { dbConnect } from "@/service/mongo";
import { generateSlug } from "@/utils/generateSlug";
import { NextRequest, NextResponse } from "next/server";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: RouteProps) {
  try {
    const { id } = await params;
    const body = await req.json();

    await dbConnect();

    const data = { ...body };
    console.log("data from put route: ", data);

    // Handle Technologies -
    // I have to make new technologies if that is not already created.
    if (
      typeof data.technologies === "string" &&
      data.technologies.trim().length > 0
    ) {
      const techNames = data.technologies
        .split(",")
        .map((tech: string) => tech.trim())
        .filter(Boolean);

      const technologyIds = [];

      for (const name of techNames) {
        const slug = name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");

        // Find or create
        const tech = await Technology.findOneAndUpdate(
          { slug },
          {
            $setOnInsert: {
              name,
              slug,
              category: "Other", // default category
            },
          },
          { upsert: true, new: true },
        );
        technologyIds.push(tech._id);
      }

      data.technologies = technologyIds;
    } else if (typeof data.technologies === "string") {
      data.technologies = [];
    }

    // Handle Tags - similar things have to be done
    if (typeof data.tags === "string" && data.tags.trim().length > 0) {
      const tagNames = data.tags
        .split(",")
        .map((tag: string) => tag.trim())
        .filter(Boolean);

      const tagIds = [];

      for (const name of tagNames) {
        const slug = name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");

        // Find or create
        const tag = await Tag.findOneAndUpdate(
          { slug },
          {
            $setOnInsert: {
              name,
              slug,
            },
          },
          { upsert: true, new: true },
        );

        tagIds.push(tag._id);
      }

      data.tags = tagIds;
    } else if (typeof data.tags === "string") {
      data.tags = [];
    }

    // handle dates (Ensuring they are date objects)
    if (data.devPhase) {
      if (data.devPhase.startDate)
        data.devPhase.startDate = new Date(data.devPhase.startDate);
      if (data.devPhase.endDate)
        data.devPhase.endDate = new Date(data.devPhase.endDate);
    }

    const updatedProject = await Project.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProject);
  } catch (error: any) {
    console.error("Error updating the project: ", error.message);
    return NextResponse.json(
      { error: "Failed to update project", details: error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteProps) {
  try {
    const { id } = await params;
    await dbConnect();

    const deleteProject = await Project.findByIdAndDelete(id);

    if (!deleteProject) {
      return NextResponse.json({ error: "Proejct not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Project deleted successfully!" });
  } catch (error: any) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project", details: error.message },
      { status: 500 },
    );
  }
}

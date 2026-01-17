import { Project, Tag, Technology } from "@/models";
import { dbConnect } from "@/service/mongo";
import { generateSlug } from "@/utils/generateSlug";
import { NextResponse } from "next/server";

export async function POST(req: NextResponse) {
  try {
    const body = await req.json();

    await dbConnect();

    const data = { ...body };

    // Handle Technologies -
    // I have to make new technologies if that is not already created.
    if (
      typeof data.technoloiges === "string" &&
      data.technologies.trim().length > 0
    ) {
      const techNames = data.technologies
        .split(",")
        .map((tech: string) => tech.trim())
        .filter(Boolean);

      const technologyIds = [];

      for (const name of techNames) {
        const slug = generateSlug(name);

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
          { upsert: true, new: true }
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
        const slug = generateSlug(name);

        // Find or create
        const tag = await Tag.findOneAndUpdate(
          { slug },
          {
            $setOnInsert: {
              name,
              slug,
            },
          },
          { upsert: true, new: true }
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

    console.log("data after all calculation: ", data);
    const newProject = await Project.create(data);

    return NextResponse.json(newProject, { status: 201 });
  } catch (error: any) {
    console.error("Error creating project: ", error);
    return NextResponse.json(
      { error: "Failed to create project", details: error.message },
      { status: 500 }
    );
  }
}

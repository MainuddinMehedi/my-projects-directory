import { Project } from "@/models";
import { dbConnect } from "@/service/mongo";
import { NextResponse } from "next/server";

export async function POST(req: NextResponse) {
  try {
    const body = await req.json();

    await dbConnect();

    const data = { ...body };

    // Handle Technologies -
    // I have to make new technologies if that is not already created.

    // Handle Tags - similar things have to be done

    // handle dates (Ensuring they are date objects)
    if (data.devPhase) {
      if (data.devPhase.startDate)
        data.devPhase.startDate = new Date(data.devPhase.startDate);
      if (data.devPhase.endDate)
        data.devPhase.endDate = new Date(data.devPhase.endDate);
    }

    // const newProject = await Project.create(data);
    const newProject = "";

    return NextResponse.json(newProject, { status: 201 });
  } catch (error: any) {
    console.error("Error creating project: ", error);
    return NextResponse.json(
      { error: "Failed to create project", details: error.message },
      { status: 500 },
    );
  }
}

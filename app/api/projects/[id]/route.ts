import { Project } from "@/models";
import { dbConnect } from "@/service/mongo";
import { NextRequest, NextResponse } from "next/server";

interface RouteProps {
  params: Promise<{ id: string }>;
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
    console.log(error);
  }
}

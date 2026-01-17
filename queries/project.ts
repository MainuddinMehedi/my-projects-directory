"use server";

import { Project } from "@/models/project-model";
import { Technology } from "@/models/technology-model";
import { dbConnect } from "@/service/mongo";

export async function getAllProjects() {
  await dbConnect();

  const projects = await Project.find({})
    .populate("technologies")
    .populate("tags")
    .sort({ "devPhase.startDate": -1 })
    .lean();

  return JSON.parse(JSON.stringify(projects));
}

export async function getFeaturedProjects(limit: number = 6) {
  await dbConnect();

  const projects = await Project.find({})
    .populate("technologies")
    .sort({ "devPhase.endDate": -1 })
    .limit(limit)
    .lean();

  return JSON.parse(JSON.stringify(projects));
}

export async function getProjectBySlug(slug: string) {
  await dbConnect();

  const project = await Project.findOne({ slug })
    .populate("technologies")
    .populate("tags")
    .lean();

  if (!project) return null;
  return JSON.parse(JSON.stringify(project));
}

export async function getProjectsByTech(techId: string) {
  await dbConnect();

  const projects = await Project.find({ technologies: techId })
    .select("pname slug thumbnail devPhase")
    .sort({ "devPhase.startDate": -1 })
    .lean();

  return JSON.parse(JSON.stringify(projects));
}

export async function getAllTechnologies() {
  await dbConnect();

  const technologies = await Technology.find({}).sort({ name: 1 }).lean();
  return JSON.parse(JSON.stringify(technologies));
}

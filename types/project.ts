import { Types } from "mongoose";

// Sub-interface for Gallery Items
export interface IGalleryItem {
  url: string;
  caption?: string;
}

// Sub-interface for Challenges
export interface IChallenge {
  title: string;
  description: string;
  solution: string;
}

// Sub-interface for Related Configurations
export interface IRelatedConfig {
  title: string;
  codeSnippet: string;
  language: string;
}

// Sub-interface for Development Phase
export interface IDevPhase {
  startDate?: Date;
  endDate?: Date;
  status: "Planned" | "In Progress" | "Completed" | "On Hold" | "Abandoned";
}

// Main Project Interface
export interface IProject {
  pname: string;
  slug: string;
  description: string;
  thumbnail: string;
  gallery: IGalleryItem[];
  repoLink?: string;
  demoLink?: string;

  // Relationships using ObjectIds
  technologies: Types.ObjectId[];
  tags?: Types.ObjectId[];

  // Knowledge Base
  details?: string;
  problemStatement?: string;
  // challenges: IChallenge[];
  // lessonsLearned: string[];
  // relatedConfigs: IRelatedConfig[];

  // Phase & Timestamps
  devPhase: IDevPhase;
  postedAt: Date;
  updatedAt: Date;
}

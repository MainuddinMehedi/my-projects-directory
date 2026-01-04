import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  // Identity
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true }, // Short summary

  // Visuals
  thumbnail: { type: String, required: false }, // Main cover image URL
  gallery: [
    {
      url: { type: String, required: true },
      caption: { type: String, required: false },
    },
  ],

  // References
  repoLink: { type: String, required: false },
  demoLink: { type: String, required: false },

  // Relationships
  technologies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Technology" }],
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],

  // Knowledge Base / Case Study
  overview: { type: String, required: false }, // Detailed Markdown
  problemStatement: { type: String, required: false }, // Detailed Markdown
  challenges: [
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
      solution: { type: String, required: true },
    },
  ],
  lessonsLearned: [{ type: String }],
  relatedConfigs: [
    {
      title: { type: String, required: true },
      codeSnippet: { type: String, required: true },
      language: { type: String, default: "text" },
    },
  ],

  // Development Phase Log
  devPhase: {
    startDate: { type: Date, required: false },
    endDate: { type: Date, required: false },
    status: {
      type: String,
      enum: ["Planned", "In Progress", "Completed", "On Hold", "Abandoned"],
      default: "In Progress",
    },
  },

  postedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update the updatedAt timestamp before saving
projectSchema.pre("save", function (this: any) {
  this.updatedAt = new Date();
});

export const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema);

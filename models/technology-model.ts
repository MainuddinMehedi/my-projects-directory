import mongoose from "mongoose";

const technologySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  icon: { type: String, required: false }, // URL or Icon class/name
  category: {
    type: String,
    required: true,
    enum: [
      "Language",
      "Framework",
      "Database",
      "Tool",
      "Library",
      "Platform",
      "Other",
    ],
    default: "Other",
  },
  docsLink: { type: String, required: false },
});

export const Technology =
  mongoose.models.Technology || mongoose.model("Technology", technologySchema);

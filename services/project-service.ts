import { Tag, Technology } from "@/models";
import { generateSlug } from "@/utils/generateSlug";

/**
 * Processes comma-separated strings of tags and technologies.
 * Finds or creates them in the database and returns their IDs.
 */
export async function processTagsAndTechs(
  technologiesStr: string | undefined,
  tagsStr: string | undefined
) {
  const techIds: string[] = [];
  const tagIds: string[] = [];

  // Process Technologies
  if (
    technologiesStr &&
    typeof technologiesStr === "string" &&
    technologiesStr.trim().length > 0
  ) {
    const techNames = technologiesStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    // Deduplicate inputs
    const uniqueTechNames = Array.from(new Set(techNames));

    const techPromises = uniqueTechNames.map(async (name) => {
      const slug = generateSlug(name);
      // Find by slug OR name to avoid duplicate key errors
      const tech = await Technology.findOneAndUpdate(
        { $or: [{ slug }, { name }] },
        {
          $setOnInsert: {
            name,
            slug,
            category: "Other",
          },
        },
        { upsert: true, new: true }
      );
      return tech._id;
    });

    const resolvedTechIds = await Promise.all(techPromises);
    techIds.push(...resolvedTechIds);
  }

  // Process Tags
  if (tagsStr && typeof tagsStr === "string" && tagsStr.trim().length > 0) {
    const tagNames = tagsStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    // Deduplicate inputs
    const uniqueTagNames = Array.from(new Set(tagNames));

    const tagPromises = uniqueTagNames.map(async (name) => {
      const slug = generateSlug(name);
      // Find by slug OR name
      const tag = await Tag.findOneAndUpdate(
        { $or: [{ slug }, { name }] },
        {
          $setOnInsert: {
            name,
            slug,
          },
        },
        { upsert: true, new: true }
      );
      return tag._id;
    });

    const resolvedTagIds = await Promise.all(tagPromises);
    tagIds.push(...resolvedTagIds);
  }

  return { techIds, tagIds };
}

/**
 * Prepares the raw form data for database insertion/update.
 * converting dates and structuring the payload.
 */
export async function prepareProjectData(data: any) {
  // Process relationships first
  const { techIds, tagIds } = await processTagsAndTechs(
    data.technologies,
    data.tags
  );

  // Parse Gallery
  let gallery = [];
  if (typeof data.gallery === "string" && data.gallery.trim().length > 0) {
    gallery = data.gallery
      .split(",")
      .map((url: string) => ({ url: url.trim() }));
  } else if (Array.isArray(data.gallery)) {
    gallery = data.gallery; // Already formatted (if passed from some other source)
  }

  // Parse Dates
  const devPhase = {
    status: data.devStatus,
    startDate: data.startDate ? new Date(data.startDate) : undefined,
    endDate: data.endDate ? new Date(data.endDate) : undefined,
  };

  // Construct payload
  const payload = {
    ...data,
    technologies: techIds,
    tags: tagIds,
    gallery,
    devPhase,
  };

  // Remove raw string fields that we processed
  delete payload.devStatus;
  delete payload.startDate;
  delete payload.endDate;

  return payload;
}

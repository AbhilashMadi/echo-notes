import type { Context } from "hono";

import Note from "@/models/notes.model.js";
import { responseHandler } from "@/utils/response.js";

export default async (c: Context) => {
  try {
    // Parse userId from authenticated request
    const { userId } = c.get("user");

    // Parse and validate query parameters
    const {
      sort = "desc",
      page = "1",
      limit = "6",
      search,
      favorite,
      tags,
      pinned,
    } = c.req.query();

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 6;
    const sortOrder = sort === "asc" ? 1 : -1;

    // Build MongoDB query
    const filter: Record<string, any> = { userId }; // ✅ Add userId to filter

    // Apply search filter
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        // { content: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by favorite and pinned (convert to boolean)
    if (favorite !== undefined)
      filter.favorite = favorite === "true";
    if (pinned !== undefined)
      filter.pinned = pinned === "true";

    // Filter by tags (only apply if valid tags exist)
    const tagsArr = tags?.split(",");
    if (tagsArr && tagsArr.length > 0)
      filter.tags = { $in: tagsArr };

    // Retrieve notes with filters, sorting, and pagination
    const notes = await Note.find(filter)
      .sort({ createdAt: sortOrder })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    // Get total count for pagination metadata
    const totalCount = await Note.countDocuments(filter);

    // Get all available tags for the user
    const allTags = await Note.distinct("tags", { userId });
    const sortedTags = allTags.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

    return c.json(responseHandler(true, "Notes fetched successfully", {
      sort,
      page: pageNum,
      limit: limitNum,
      total: totalCount,
      search,
      favorite,
      pinned,
      tags: sortedTags, // Include the available tags in the response
      filterTags: tagsArr,
      notes,
    }));
  }
  catch (error) {
    console.error("Get notes error:", error);
    throw error;
  }
};

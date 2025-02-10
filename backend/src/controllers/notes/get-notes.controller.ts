import type { Context } from "hono";

import { Note } from "@/models/notes.model.js";
import { responseHandler } from "@/utils/response.js";

export default async (c: Context) => {
  try {
    // Parse and validate query parameters
    const { sort, page, limit, search, favorite, tags } = c.req.query();

    const pageNum = Number.parseInt(page);
    const limitNum = Number.parseInt(limit);
    const sortOrder = sort === "asc" ? 1 : -1;

    // Build MongoDB query
    const filter: any = {};

    // Apply search filter
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }
    // Filter by favorite
    if (favorite)
      filter.favorite = favorite === "true";
    // Filter by tags (assuming tags are stored as an array in MongoDB)
    if (tags?.length)
      filter.tags = { $in: tags };

    // Retrieve notes from MongoDB with filters, sorting, and pagination
    const notes = await Note.find(filter)
      .sort({ createdAt: sortOrder })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    // Get total count for pagination metadata
    const totalCount = await Note.countDocuments(filter);

    return c.json(responseHandler(true, "", {
      sort,
      page: pageNum,
      limit: limitNum,
      total: totalCount,
      search,
      favorite,
      tags,
      notes,
    }));
  }
  catch (error) {
    console.error("Get notes error: ", error);
    throw error;
  }
};

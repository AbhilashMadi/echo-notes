import type { Document, Model, Types } from "mongoose";

import mongoose, { Schema } from "mongoose";

import type { BlockNoteContentSchema } from "@/validations/schemas/notes.schema.js";

export interface INote extends Document {
  userId: Types.ObjectId;
  title: string;
  content: BlockNoteContentSchema[];
  images: string[];
  favorite: boolean;
  pinned: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    content: { type: Schema.Types.Mixed, default: [] },
    images: { type: [String], default: [] },
    favorite: { type: Boolean, default: false },
    pinned: { type: Boolean, default: false },
    tags: { type: [String], default: [] },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        ret.noteId = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

// // Middleware to update user's tags when a note is saved
// NoteSchema.pre<INote>("save", async function (next) {
//   if (this.isModified("tags") && this.tags.length > 0) {
//     try {
//       // Sort tags alphabetically before saving
//       this.tags = [...new Set(this.tags)].sort((a, b) => a.localeCompare(b));

//       await User.findByIdAndUpdate(this.userId, {
//         // To Avoid duplicate tags
//         $addToSet: { tags: { $each: this.tags } },
//       });
//     }
//     catch (error: any) {
//       return next(error);
//     }
//   }
//   next();
// });

// Indexing for Performance
NoteSchema.index({ userId: 1, createdAt: -1 });
NoteSchema.index({ tags: 1 });
NoteSchema.index({ userId: 1, favorite: 1 });
NoteSchema.index({ userId: 1, pinned: 1 });

const Note: Model<INote> = mongoose.model<INote>("Note", NoteSchema);
export default Note;

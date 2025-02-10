import type { Document, Model, Types } from "mongoose";

import mongoose, { Schema } from "mongoose";

export interface INote extends Document {
  userId: Types.ObjectId;
  title: string;
  content: string;
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
    title: { type: String, required: true, unique: true },
    content: { type: String, required: true }, // Markdown content
    images: { type: [String], default: [] },
    favorite: { type: Boolean, default: false, index: true },
    pinned: { type: Boolean, default: false, index: true },
    tags: { type: [String], default: [], index: true },
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
    }
  },
);

NoteSchema.index({ userId: 1, _id: 1 });

// Create and export User model
const Note: Model<INote> = mongoose.model<INote>("Note", NoteSchema);
export default Note;

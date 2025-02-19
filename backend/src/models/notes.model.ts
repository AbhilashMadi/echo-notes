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
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true }, // Index for fast retrieval
    title: { type: String, required: true, unique: true },
    content: { type: String, required: true }, // Markdown content
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
    }
  }
);

<<<<<<< Updated upstream
<<<<<<< Updated upstream
// 🔥 Indexing for Performance
// Compound index for retrieving notes by user & sorting by creation time
=======
=======
>>>>>>> Stashed changes
// Indexing for Performance
>>>>>>> Stashed changes
NoteSchema.index({ userId: 1, createdAt: -1 });
// Index tags as multi-key field (each tag is indexed for efficient querying)
NoteSchema.index({ tags: 1 });
// Optimized queries for favorite and pinned notes
NoteSchema.index({ userId: 1, favorite: 1 });
NoteSchema.index({ userId: 1, pinned: 1 });

const Note: Model<INote> = mongoose.model<INote>("Note", NoteSchema);
export default Note;

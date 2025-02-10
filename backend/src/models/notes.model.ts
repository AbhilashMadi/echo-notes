import type { Document, Types } from "mongoose";

import mongoose, { Schema } from "mongoose";

export interface INote extends Document {
  userId: Types.ObjectId; // Owner of the note
  title: string;
  content: string;
  audioUrl?: string; // If recorded audio is uploaded
  transcription?: string; // Transcribed text from audio
  imageUrl?: string; // Optional image attachment
  favorite: boolean; // If the note is marked as a favorite
  pinned: boolean; // If the note is pinned for quick access
  tags: string[]; // Tags for categorization
  collaborators: Types.ObjectId[]; // Other users who can edit the note
  permissions: Record<string, "read" | "write">; // Access control (e.g., { "userId": "write" })
  reminderDate?: Date; // Date for reminder notifications
  version: number; // Track versions of edits
  lastEditedBy: Types.ObjectId; // User who last edited the note
  isDeleted: boolean; // Soft delete flag
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    audioUrl: { type: String, default: null },
    transcription: { type: String, default: null },
    imageUrl: { type: String, default: null },
    favorite: { type: Boolean, default: false },
    pinned: { type: Boolean, default: false }, // New Feature: Pin a note
    tags: { type: [String], default: [] }, // New Feature: Tags for searchability
    collaborators: { type: [Schema.Types.ObjectId], ref: "User", default: [] }, // New Feature: Shared editing
    permissions: { type: Map, of: String, default: {} }, // New Feature: Role-based access
    reminderDate: { type: Date, default: null }, // New Feature: Reminder for notes
    version: { type: Number, default: 1 }, // New Feature: Versioning
    lastEditedBy: { type: Schema.Types.ObjectId, ref: "User", default: null }, // New Feature: Track last editor
    isDeleted: { type: Boolean, default: false }, // New Feature: Soft delete functionality
  },
  { timestamps: true },
);

export const Note = mongoose.model<INote>("Note", NoteSchema);

import type { Document, Model } from "mongoose";

import bcrypt from "bcryptjs";
import mongoose, { Schema } from "mongoose";

// Interface for User Document
export interface IUser extends Document {
  email: string;
  password: string;
  emailVerificationOtp?: string;
  emailVerified: boolean;

  matchPassword: (enteredPassword: string) => Promise<boolean>;
}

// User Schema
const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    emailVerificationOtp: {
      type: String,
      required: false, // OTP is optional until needed
    },
    emailVerified: {
      type: Boolean,
      default: false, // Default to false until verification
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        // Exclude password from JSON responses
        delete ret.password;
        delete ret.emailVerificationOtp;
        delete ret._id;
        delete ret.__v;

        return ret;
      },
    },
  },
);

// Hash password before saving
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password"))
    return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create and export User model
const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
export default User;

import mongoose, { Schema, Document } from "mongoose";

// Define the IUser interface to be used with TypeScript for type safety
export interface IUser extends Document {
  clerkId: string;
  email: string;
  username: string;
  photo: string;
  firstName?: string;
  lastName?: string;
}

const UserSchema = new Schema<IUser>({
  clerkId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  photo: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
}, { timestamps: true });

// Check if the model already exists in Mongoose models, and create it if not
const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;

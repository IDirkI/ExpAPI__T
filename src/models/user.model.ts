import mongoose from "mongoose";
import { Areas } from "../types/areaType";

export interface UserI {
  name: string;
  tag: string;
  age: number;
  area: Areas;

  email: string;
  password: string;
  role?: string;

  token?: string;
}

const userSchema = new mongoose.Schema<UserI>({
  name: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  area: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
  },
  token: {
    type: String,
  },
});

export const User = mongoose.model<UserI>("User", userSchema);

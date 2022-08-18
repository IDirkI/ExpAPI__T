import mongoose from "mongoose";
import { Characters } from "../types/characterType";

export interface PlayerI {
  name: string;
  tag?: string;
  age: number;
  main?: Characters;
  secondary?: Characters[];

  seed?: number;
  win?: number;
  loss?: number;

  won?: string[];
  lost?: string[];
}

const playerSchema = new mongoose.Schema<PlayerI>({
  name: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
  },
  age: {
    type: Number,
    required: true,
  },
  main: {
    type: String,
  },
  secondary: {
    type: [String],
  },
  seed: {
    type: Number,
  },
  win: {
    type: Number,
  },
  loss: {
    type: Number,
  },
  won: {
    type: [String],
  },
  lost: {
    type: [String],
  }
});

export const Player = mongoose.model<PlayerI>("Player", playerSchema);

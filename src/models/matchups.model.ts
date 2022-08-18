import mongoose, { Schema, Types } from "mongoose";
import { Characters } from "../types/characterType";

export interface MatchupI {
  player_id_1: Types.ObjectId;
  sets_1: number;

  player_id_2: Types.ObjectId;
  sets_2: number;

  winId: Types.ObjectId;
}

const matchupSchema = new Schema<MatchupI>({
  player_id_1: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  sets_1: {
    type: Number,
  },
  player_id_2: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  sets_2: {
    type: Number,
    required: true,
  },
  winId: {
    type: Schema.Types.ObjectId,
    required: true,
  }
});

export const Match = mongoose.model<MatchupI>("Matches", matchupSchema);

import mongoose from "mongoose";
import { Player } from "../models/player.model";
import { Match } from "../models/matchups.model";
import { User } from "../models/user.model";

const DB_URI = "mongodb://localhost:27017";

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log("Successfully connected to database");
  })
  .catch((error) => {
    console.log("database connection failed. exiting now...");
    console.error(error);
    process.exit(1);
  });

const models = {
  Player,
  Match,
  User,
};

export { models, mongoose };

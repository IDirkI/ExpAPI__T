import express from "express";
import CreatePlayerService from "../services/player.registrations.service";
import { models, Types } from "mongoose";
import ServerError from "../types/server.errors";
import SeedUpdater from "../utils/updater/update.player.seed";
import { SeedUpdateTypes } from "../utils/enums/seedTypeEnum";
import { ErrorCodes } from "../utils/enums/errorCodeEnum";
import SuccessDataResult from "../utils/results/successDataResult";
import SuccessResult from "../utils/results/successResult";

const playerRouter = express.Router();
const s_updater = new SeedUpdater();

playerRouter.get("/", async (req, res, next) => {
  try {
    const docs = await models.Player.find();

    res.send(new SuccessDataResult(docs));
  } catch (err) {
    return next(err);
  }
});

playerRouter.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const doc = await models.Player.findById(new Types.ObjectId(id));

    // Error Handle: No player with the id exists
    if (!doc) throw ServerError.error(ErrorCodes.NO_ID_MATCH);

    res.send(
      new SuccessDataResult({
        player: doc,
      })
    );
  } catch (err) {
    return next(err);
  }
});

playerRouter.post("/", async (req, res, next) => {
  try {
    const { name, tag, age, main, secondary } = req.body;

    const createPlayerService = new CreatePlayerService();

    const playerProfile = await createPlayerService.execute(
      name,
      tag,
      age,
      main,
      secondary
    );

    return res.json(
      new SuccessDataResult({
        playerID: playerProfile.id,
      })
    );
  } catch (err) {
    return next(err);
  }
});

playerRouter.put("/:id/:seed", async (req, res, next) => {
  try {
    const { id, seed } = req.params;

    await s_updater.updatePlayerSeed(
      new Types.ObjectId(id),
      parseInt(seed),
      SeedUpdateTypes.INSERT
    );

    res.send(new SuccessResult("Successfully Updated Seeds!"));
  } catch (err) {
    return next(err);
  }
});

playerRouter.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    await models.Player.deleteOne({ _id: id });

    res.send(new SuccessResult("Successfully Deleted Player!"));
  } catch (err) {
    return next(err);
  }
});

// DELETE unit test players
playerRouter.delete("/", async (req, res, next) => {
  try {
    await models.Player.deleteMany({ name: "TEST" });

    res.send(new SuccessResult("Successfully Deleted Tests!"));
  } catch (err) {
    return next(err);
  }
});

export default playerRouter;

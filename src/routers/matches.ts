import express from "express";
import EnterResult from "../services/match.registrations.service";
import { models, Types } from "mongoose";
import TagUpdater from "../utils/updater/update.player.tags";
import { TagUpdateTypes } from "../utils/enums/tagTypeEnum";
import ServerError from "../types/server.errors";
import { ErrorCodes } from "../utils/enums/errorCodeEnum";
import SuccessDataResult from "../utils/results/successDataResult";
import SuccessResult from "../utils/results/successResult";

const updater = new TagUpdater();
const matchRouter = express.Router();

matchRouter.get("/", async (req, res, next) => {
  try {
    const createNewResult = new EnterResult();
    const matchPlayerRelation = await createNewResult.joinWithPlayers();
    return res.send(new SuccessDataResult(matchPlayerRelation));
  } catch (err) {
    return next(err);
  }
});

matchRouter.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const doc = await models.Match.findById(new Types.ObjectId(id));

    // Error Handle: No id match
    if (!doc) throw ServerError.error(ErrorCodes.NO_ID_MATCH);

    return res.send(new SuccessDataResult(doc));
  } catch (err) {
    return next(err);
  }
});

matchRouter.post("/", async (req, res, next) => {
  try {
    const { id_1, sets_1, id_2, sets_2 } = req.body;

    const createNewResult = new EnterResult();

    const matchResult = await createNewResult.execute(
      id_1,
      sets_1,

      id_2,
      sets_2
    );

    return res.json(
      new SuccessDataResult({
        matchId: matchResult.id,
      })
    );
  } catch (err) {
    return next(err);
  }
});

matchRouter.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const selectedMatch = await models.Matches.findById(new Types.ObjectId(id));

    // Error Handle: No matching id
    if (!selectedMatch) throw ServerError.error(ErrorCodes.NO_ID_MATCH);

    const winId = selectedMatch.winId;
    const loserId =
      selectedMatch.winId.toString() === selectedMatch.player_id_1.toString()
        ? selectedMatch.player_id_2
        : selectedMatch.player_id_1;

    // Undo Match Results
    updater.updatePlayerMatchTags(winId, loserId, TagUpdateTypes.REMOVE);

    // Delete match from db
    await models.Matches.deleteOne({ _id: id });

    res.send(new SuccessResult("Successfully Deleted Match"));
  } catch (err) {
    return next(err);
  }
});

export default matchRouter;

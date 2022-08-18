import { Types } from "mongoose";
import { models } from "../modules/Mongo";
import ServerError from "../types/server.errors";
import TagUpdater from "../utils/updater/update.player.tags";
import { TagUpdateTypes } from "../utils/enums/tagTypeEnum";
import { ErrorCodes } from "../utils/enums/errorCodeEnum";

export default class EnterResult {
  async execute(id_1: string, sets_1: number, id_2: string, sets_2: number) {
    // Error Handle: Impossible set numbers
    this.validateSets(sets_1, sets_2);

    const updater = new TagUpdater();

    const player_id_1 = new Types.ObjectId(id_1);
    const player_id_2 = new Types.ObjectId(id_2);

    const winId = sets_1 > sets_2 ? player_id_1 : player_id_2;

    const newResult = new models.Match({
      player_id_1,
      sets_1,

      player_id_2,
      sets_2,

      winId,
    });

    // Update Player Win/Loss
    const lossId =
      winId.toString() === player_id_1.toString() ? player_id_2 : player_id_1;

    await updater.updatePlayerMatchTags(winId, lossId, TagUpdateTypes.ADD);

    await newResult.save();
    return newResult;
  }

  async joinWithPlayers() {
    const matchCollection = models.Match;

    return await matchCollection.aggregate(
      [
        {
          $lookup: {
            from: "players",
            localField: "player_id_1",
            foreignField: "_id",
            as: "player_1",
          },
        },
        {
          $lookup: {
            from: "players",
            localField: "player_id_2",
            foreignField: "_id",
            as: "player_2",
          },
        },
      ],
      (err, data) => {
        // Error Handle: general(?)
        if (err) throw new ServerError(err.message, 400);
        return data;
      }
    );
  }

  validateSets(sets_1: number, sets_2: number) {
    let valid = true;

    if (sets_1 < 0 || sets_2 < 0) valid = false;
    else if (sets_1 > 3 || sets_2 > 3) valid = false;
    else if (!(3 <= sets_1 + sets_2 || sets_1 + sets_2 >= 5)) valid = false;

    // Error Handle: Impossible set numbers
    if (!valid) throw ServerError.error(ErrorCodes.INVALID_SET_NUMBER);

    return;
  }
}

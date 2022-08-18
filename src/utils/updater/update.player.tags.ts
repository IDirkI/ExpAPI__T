import { models, Types } from "mongoose";
import ServerError from "../../types/server.errors";
import { TagUpdateTypes } from "../enums/tagTypeEnum";
import { ErrorCodes } from "../enums/errorCodeEnum";

export default class TagUpdater {
  async updatePlayerMatchTags(
    winnerId: Types.ObjectId,
    loserId: Types.ObjectId,
    action: TagUpdateTypes
  ) {
    const playerW = await models.Player.findById(new Types.ObjectId(winnerId));
    const playerL = await models.Player.findById(new Types.ObjectId(loserId));

    // Error Handle: Winner or Loser not available 
    if (!playerW || !playerL) throw ServerError.error(ErrorCodes.NO_ID_MATCH);

    const loserTag = playerL.tag;
    const winnerTag = playerW.tag;

    let loserArr = playerL.lost;
    let winnerArr = playerW.won;

    switch (action) {
      case TagUpdateTypes.ADD:
        winnerArr.push(loserTag);
        loserArr.push(winnerTag);

        break;

      case TagUpdateTypes.REMOVE:
        try {
          loserArr.splice(loserArr.indexOf(winnerTag), 1);
          winnerArr.splice(winnerArr.indexOf(loserTag), 1);
        } catch {
          // Error Handle: Array not containing target value
          throw ServerError.error(ErrorCodes.NO_DATA);
        }

        break;

      default:
        // Error Handle: Invalid action
        throw ServerError.error(ErrorCodes.NO_ACTION);
    }

    await models.Player.findByIdAndUpdate(winnerId, { won: winnerArr });
    await models.Player.findByIdAndUpdate(loserId, { lost: loserArr });

    await this.updatePlayerResults([winnerId, loserId]);
  }

  async updatePlayerResults(playerIds: Types.ObjectId[]) {
    playerIds.forEach(async (player_id) => {
      const player = await models.Player.findById(player_id);
      const wonArr = player.won;
      const lossArr = player.lost;

      const wonArrLength = wonArr.length == 0 ? null : wonArr.length;
      const lossArrLength = lossArr.length == 0 ? null : lossArr.length;

      await models.Player.findByIdAndUpdate(player_id, { win: wonArrLength });
      await models.Player.findByIdAndUpdate(player_id, { loss: lossArrLength });
    });
  }


}

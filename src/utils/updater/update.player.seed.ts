import { models, Types } from "mongoose";
import ServerError from "../../types/server.errors";
import { SeedUpdateTypes } from "../enums/seedTypeEnum";
import { ErrorCodes } from "../enums/errorCodeEnum";

export default class SeedUpdater {
  async updatePlayerSeed(
    playerId: Types.ObjectId,
    seed: number,
    method: SeedUpdateTypes
  ) {
    const targetPlayer = await models.Player.findById(playerId);
    const currSeed = targetPlayer.seed;

    // Error Handle: Tyring to change into the current seed
    if (currSeed === seed)
      throw new ServerError(
        `The player is already seeded as seed ${seed}`,
        400
      );

    const playersWithSeed = await models.Player.findOne({ seed: seed });
    const seedPlayerId = playersWithSeed.id;

    if (!playersWithSeed) {
      await models.Player.findByIdAndUpdate(playerId, { seed: seed });
    } else {
      switch (method) {
        case SeedUpdateTypes.SWAP: {
          await models.Player.findByIdAndUpdate(playerId, { seed: seed });
          await models.Player.findByIdAndUpdate(seedPlayerId, {
            seed: currSeed,
          });

          break;
        }

        case SeedUpdateTypes.SEND_BACK: {
          await models.Player.findByIdAndUpdate(playerId, { seed: seed });
          await models.Player.findByIdAndUpdate(seedPlayerId, { seed: null });

          await models.Player.updateMany(
            { seed: { $gt: currSeed } },
            { $inc: { seed: -1 } }
          );

          await models.Player.findByIdAndUpdate(seedPlayerId, {
            seed: await this.generateNewSeed(),
          });

          break;
        }

        case SeedUpdateTypes.INSERT: {
          if (seed > currSeed) {
            await models.Player.findByIdAndUpdate(playerId, { seed: null });

            await models.Player.updateMany(
              { seed: { $gt: currSeed, $lte: seed } },
              { $inc: { seed: -1 } }
            );

            await models.Player.findByIdAndUpdate(playerId, { seed: seed });
          } else {
            await models.Player.findByIdAndUpdate(playerId, { seed: null });

            await models.Player.updateMany(
              { seed: { $gte: seed, $lt: currSeed } },
              { $inc: { seed: 1 } }
            );

            await models.Player.findByIdAndUpdate(playerId, { seed: seed });
          }

          break;
        }

        default: {
            throw ServerError.error(ErrorCodes.NO_ACTION);
        }
      }

      return;
    }
  }

  async generateNewSeed() {
    const lastSeeded = await models.Player.findOne().sort("-seed");

    // Initial case: 0 players
    if (!lastSeeded) return 1;

    return lastSeeded.seed += 1;
  }
}

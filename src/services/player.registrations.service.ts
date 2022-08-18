import { models } from "../modules/Mongo";
import ServerError from "../types/server.errors";
import { Characters } from "../types/characterType";
import SeedUpdater from "../utils/updater/update.player.seed";
import { ErrorCodes } from "../utils/enums/errorCodeEnum";

export default class CreatePlayerService {
  async execute(
    name: string,
    tag: string,
    age: Number,
    main: Characters[],
    secondary: Characters[]
  ) {
    const playerAlreadyExists = await models.Player.findOne({
      tag,
    });

    // Error Handle: Player tag repeat
    if (playerAlreadyExists) {
      throw ServerError.error(ErrorCodes.DUPLICATE_TAG);
    }

    const win = null;
    const loss = null;

    const updater = new SeedUpdater();
    const seed = await updater.generateNewSeed();

    const newPlayer = new models.Player({
      name,
      tag,
      age,
      main,
      secondary,

      seed,
      win,
      loss,
    });

    await newPlayer.save();

    return newPlayer;
  }
}

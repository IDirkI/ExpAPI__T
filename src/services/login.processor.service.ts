import { models } from "../modules/Mongo";
import ServerError from "../types/server.errors";
import { ErrorCodes } from "../utils/enums/errorCodeEnum";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default class LoginProcessor {
  async execute(email: string, password: string) {
    // Error Handle: email or password not present in body
    if (!(email && password)) {
      throw ServerError.error(ErrorCodes.EMPTY_INPUT);
    }

    const user = await models.User.findOne({ email: email });

    // Error Handle: No user with the given email adress
    if (!user) {
      throw ServerError.error(ErrorCodes.NO_EMAIL_MATCH);
    }

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY as string,
        {
          expiresIn: "5h",
        }
      );

      user.token = token;

      return user;
    }

    // Error Handle: Wrong password
    throw ServerError.error(ErrorCodes.INVALID_FIELDS);
  }
}

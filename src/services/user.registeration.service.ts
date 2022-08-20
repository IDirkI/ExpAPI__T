import { Areas } from "../types/areaType";
import { models } from "../modules/Mongo";
import ServerError from "../types/server.errors";
import { ErrorCodes } from "../utils/enums/errorCodeEnum";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default class CreateUserService {
  async execute(
    name: string,
    tag: string,
    age: number,
    area: Areas,
    email: string,
    password_N: string
  ) {
    // Error Handle: Same email
    const oldUser = await models.User.findOne({ email: email });
    if (oldUser) throw ServerError.error(ErrorCodes.DUPLICATE_EMAIL);

    const password_ENC = await bcrypt.hash(password_N, 10);

    const tempRole = null;

    const newUser = await models.User.create({
      name,
      tag,
      age,
      area,
      email: email.toLowerCase(),
      password: password_ENC,
      role: tempRole
    });

    const token = jwt.sign(
      { user_id: newUser._id, email },
      process.env.TOKEN_KEY as string,
      {
        expiresIn: "5h",
      }
    );

    newUser.token = token;
    await newUser.save();

    return newUser;
  }
}

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import ServerError from "../types/server.errors";
import { ErrorCodes } from "../utils/enums/errorCodeEnum";
dotenv.config();

const verify = (req: any, res: any, next: any) => { // FIXME: Fix parameter types
    console.log("auth");
    const token: string = req.body.token || req.query.token || req.headers["x-access-token"];

    if(!token) {
        throw ServerError.error(ErrorCodes.NO_TOKEN);
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY as string);
        req.user = decoded;
    } catch(err) {
        throw ServerError.error(ErrorCodes.BAD_TOKEN);
    }

    return next();
    
}

export default verify;

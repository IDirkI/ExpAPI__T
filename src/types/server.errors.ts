import { ErrorCodes } from "../utils/enums/errorCodeEnum";

export default class ServerError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.status = status;
  }

  static error(errorCode: ErrorCodes) {
    let errorMessage: string;
    let code: number;

    switch (errorCode) {
      case ErrorCodes.NO_ID_MATCH: {
        errorMessage =
          "Couldn't find an element with matching id in the selected field";
        code = 404;

        break;
      }

      case ErrorCodes.FIELD_EMPTY: {
        errorMessage = "The field you are looking at is empty";
        code = 404;

        break;
      }

      case ErrorCodes.NO_ACTION: {
        errorMessage = "There is no such action";
        code = 405;

        break;
      }

      case ErrorCodes.INVALID_SET_NUMBER: {
        errorMessage = "Invalid number of sets for the match";
        code = 406;

        break;
      }

      case ErrorCodes.DUPLICATE_TAG: {
        errorMessage = "There is already a player with the tame tag";
        code = 406;

        break;
      }

      case ErrorCodes.SAME_SEED: {
        errorMessage = "The players seed cannot be changed to itself";
        code = 406;

        break;
      }

      case ErrorCodes.NO_DATA: {
        errorMessage = "The data to change doesn't exist";
        code = 406;

        break;
      }

      case ErrorCodes.DUPLICATE_EMAIL: {
        errorMessage = "This email adress is already used by another user";
        code = 406;

        break;
      }

      case ErrorCodes.EMPTY_INPUT: {
        errorMessage = "One or more required input field(s) is left empty";
        code = 400;

        break;
      }

      case ErrorCodes.NO_EMAIL_MATCH: {
        errorMessage =
          "Couldn't find the user with te specified email adress";
        code = 404;
      }

      case ErrorCodes.INVALID_FIELDS: {
        errorMessage =
          "Incorrect password";
        code = 400;
      }

      case ErrorCodes.NO_TOKEN: {
        errorMessage =
          "Missing token for vaildation";
        code = 400;
      }

      case ErrorCodes.BAD_TOKEN: {
        errorMessage =
          "Token does not match what is expected";
        code = 400;
      }

      default: {
        errorMessage = "Something went wrong";
        code = 500;

        break;
      }
    }

    return new ServerError(errorMessage, code);
  }
}

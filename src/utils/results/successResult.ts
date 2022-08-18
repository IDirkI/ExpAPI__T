import Result from "./result";

export default class SuccessResult extends Result {
  constructor(public message?: string) {
    super(true, message);
  }
}
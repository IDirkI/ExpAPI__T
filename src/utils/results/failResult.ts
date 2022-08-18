import Result from "./result";

export default class FailResult extends Result {
  constructor(public message?: string) {
    super(false, message);
  }
}
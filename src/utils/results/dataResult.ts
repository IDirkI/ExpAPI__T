import Result from "./result";

export default class DataResult<T> extends Result {
  constructor(
    public data: T,
    public success?: boolean,
    public message?: string
  ) {
    super(success, message);
    this.data = data;
  }
}
import DataResult from "./dataResult";

export default class SuccessDataResult<T> extends DataResult<T> {
  constructor(public data: T, message?: string) {
    super(data, true, message);
  }
}
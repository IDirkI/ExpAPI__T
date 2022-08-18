import DataResult from "./dataResult";

export default class FailDataResult<T> extends DataResult<T> {
  constructor(public data: T, message?: string) {
    super(data, false, message);
  }
}
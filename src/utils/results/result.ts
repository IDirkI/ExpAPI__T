export default class Result {
    constructor(public success?: boolean, public message?: string) {
      this.success = success;
      this.message = message;
    }
  }
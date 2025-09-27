export default class ResponseModel<S, T> {
  #status: S;
  #data: T;
  #message: string;
  constructor(status: S, data: T, message: string) {
    this.#status = status;
    this.#data = data;
    this.#message = message;
  }
  getResponse() {
    return {
      status: this.#status,
      data: this.#data,
      message: this.#message,
    };
  }
}

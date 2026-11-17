// Thrown by the DAL when an external API answers with a non-2xx status
export class HttpRequestError extends Error {
  readonly status: number;

  constructor(status: number) {
    super(`External request failed with status ${status}`);
    this.name = 'HttpRequestError';
    this.status = status;
  }
}

// Thrown by tasks when the requested entity does not exist; routes turn it into 404
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

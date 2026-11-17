// Thrown by the DAL when an external API answers with a non-2xx status
export class HttpRequestError extends Error {
  readonly status: number;

  constructor(status: number) {
    super(`External request failed with status ${status}`);
    this.name = 'HttpRequestError';
    this.status = status;
  }
}

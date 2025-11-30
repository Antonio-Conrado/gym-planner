export enum status {
  PENDING = "PENDING", // pending confirmation
  CONFIRMED = "CONFIRMED", // confirmed by the trainer
  CANCELED = "CANCELED", // cancelled by the trainer or gym/admin
  MISSED = "MISSED", // client did not attend
  COMPLETED = "COMPLETED", // session completed successfully
  RESCHEDULED = "RESCHEDULED", // session rescheduled
  SUCCESS = "SUCCESS", // operation was successful
  WARNING = "WARNING", // operation completed with warning
  ERROR = "ERROR", // operation failed
  SCHEMAERROR = "SCHEMAERROR", // schema validation failed
}

export interface InitialState<T, D = undefined> {
  message: string;
  errors: T;
  data?: D;
  status: status;
}

export const createInitialState = <T, D = undefined>(
  errors: T,
  data?: D
): InitialState<T, D> => ({
  message: "",
  errors,
  data,
  status: status.PENDING,
});

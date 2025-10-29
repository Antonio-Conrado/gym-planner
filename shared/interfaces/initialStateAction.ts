export enum status {
  SUCCESS = "SUCCESS",
  COMPLETED = "COMPLETED",
  WARNING = "WARNING",
  PENDING = "PENDING",
  CANCELED = "CANCELED",
  ERROR = "ERROR",
}

export interface InitialState<T> {
  message: string;
  errors: T;
  status: status;
}

export const createInitialState = <T>(errors: T): InitialState<T> => ({
  message: "",
  errors,
  status: status.PENDING,
});

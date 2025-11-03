export enum status {
  SUCCESS = "SUCCESS",
  COMPLETED = "COMPLETED",
  WARNING = "WARNING",
  PENDING = "PENDING",
  CANCELED = "CANCELED",
  ERROR = "ERROR",
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

import { ERROR_CODE, ERROR_NAME } from "@/config/error.config";
import { ZodError, ZodIssue } from "zod";

export type ErrorResponseType = {
  name: string;
  message: string;
  code: number;
  status: false;
  error?: unknown;
};
class ErrorHandler extends Error {
  status: false;
  error?: unknown;
  code: number;
  constructor(message: string, code: keyof typeof ERROR_CODE, error?: unknown) {
    super(message);
    this.status = false;
    this.error = error;
    this.code = ERROR_CODE[code];
    this.name = ERROR_NAME[code];
  }
}

function formatZodError(issues: ZodIssue[]): string {
  return issues
    .slice(0, 2)
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("; ");
}

function standardizeApiError(error: unknown): ErrorResponseType {
  if (error instanceof ErrorHandler) {
    return {
      name: error.name,
      message: error.message,
      code: error.code,
      status: false,
      error: error.error,
    };
  }
  if (error instanceof ZodError) {
    return {
      name: error.name,
      message: formatZodError(error.issues),
      code: ERROR_CODE.UNPROCESSABLE_ENTITY,
      status: false,
    };
  }
  return {
    name: ERROR_NAME.INTERNAL_SERVER_ERROR,
    message:
      "We're sorry for the inconvenience. Please report this issue to our support team ",
    code: ERROR_CODE.INTERNAL_SERVER_ERROR,
    status: false,
  };
}
export { ErrorHandler, standardizeApiError };

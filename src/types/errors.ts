export interface ErrorType {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

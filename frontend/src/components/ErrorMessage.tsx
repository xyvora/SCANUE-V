import type { FC } from "react";

interface ErrorMessageProps {
  error: string | null;
}

const ErrorMessage: FC<ErrorMessageProps> = ({ error }) => {
  return error ? <div className="text-red-500">{error}</div> : null;
};

export default ErrorMessage;

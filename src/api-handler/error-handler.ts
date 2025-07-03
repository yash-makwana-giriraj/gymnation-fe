import { ErrorResponse } from "@/interfaces/global";
import { notFound } from "next/navigation";

const errorHandler = (responseBody: ErrorResponse): void => {
  console.error(responseBody)
  if (responseBody.status === 404) {
    notFound();
  }
};

export default errorHandler;

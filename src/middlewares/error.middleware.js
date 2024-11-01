import { BAD_REQUEST, INTERNAL_SERVER } from "../constant/error_code.js";
import AppError from "../utils/app_error.js";

const handleZodError = (err) => {
  const errors = Object.values(err.issues).map((el) => el.message);

  const message = errors.join(". ");

  return new AppError(message, BAD_REQUEST);
};

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  if (err.name === "ZodError") error = handleZodError(error);

  res.status(error.statusCode || INTERNAL_SERVER).json({
    status: error.status || "Error",
    message: error.message || "Internal Server Error",
  });
};

export default errorHandler;

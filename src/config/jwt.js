import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { UNAUTHORIZED } from "../constant/error_code.js";
import catchAsync from "../utils/catch_async.js";
import AppError from "../utils/app_error.js";

dotenv.config();

const createAccessToken = (data) => {
  const accessToken = jwt.sign({ payload: data }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return accessToken;
};

const createRefreshToken = (data) => {
  const refreshToken = jwt.sign(
    { payload: data },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    },
  );
  return refreshToken;
};

const verifyToken = (token) => {
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return true;
  } catch (error) {
    return false;
  }
};

const middlewareToken = catchAsync((req, res, next) => {
  const { authorization } = req.headers;
  const access_token = authorization?.split(" ")[1];

  if (!verifyToken(access_token)) {
    return next(new AppError("Unauthorized", UNAUTHORIZED));
  }

  next();
});

const decodeToken = (authorization) => {
  const token = authorization.split(" ")[1];
  const {
    payload: { userId },
  } = jwt.decode(token);
  return userId;
};

export { createAccessToken, createRefreshToken, middlewareToken, decodeToken };

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { UNAUTHORIZED } from "../constant/error_code.js";

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

const middlewareToken = (req, res, next) => {
  const { token } = req.headers;

  if (!verifyToken(token)) {
    return res.status(UNAUTHORIZED).json({ message: "Unauthorized" });
  }

  next();
};

export { createAccessToken, createRefreshToken, middlewareToken };

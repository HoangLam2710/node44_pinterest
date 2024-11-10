import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import crypto from "crypto";

import {
  BAD_REQUEST,
  CREATED,
  INTERNAL_SERVER,
  OK,
} from "../constant/error_code.js";
import { createAccessToken, createRefreshToken } from "../config/jwt.js";
import catchAsync from "../utils/catch_async.js";
import AppError from "../utils/app_error.js";
import { omitUser } from "../utils/user.js";
import {
  createMailForgotPassword,
  transporter,
} from "../config/transporter.js";

const prisma = new PrismaClient();

const register = catchAsync(async (req, res, next) => {
  const { email, password, fullName, age } = req.body;

  const userExist = await prisma.users.findFirst({
    where: { email },
  });

  if (userExist) {
    return next(new AppError("User already exists", BAD_REQUEST));
  }

  const userNew = await prisma.users.create({
    data: {
      uid: uuidv4(),
      email,
      password: bcrypt.hashSync(password, 10),
      full_name: fullName,
      age,
      user_name: email.split("@")[0],
    },
  });

  return res.status(CREATED).json({
    message: "Register successfully",
    data: omitUser(userNew),
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await prisma.users.findFirst({
    where: { email },
  });
  if (!user) {
    return next(new AppError("Email not found", BAD_REQUEST));
  }

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return next(new AppError("Incorrect password", BAD_REQUEST));
  }

  const accessToken = createAccessToken({ uid: user.uid });
  const refreshToken = createRefreshToken({ uid: user.uid });
  await prisma.users.update({
    where: { uid: user.uid },
    data: {
      refresh_token: refreshToken,
    },
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(OK).json({
    message: "Login successfully",
    data: {
      ...omitUser(user),
      token: accessToken,
    },
  });
});

const extendToken = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return next(new AppError("Token not found", UNAUTHORIZED));
  }

  const checkUser = await prisma.users.findFirst({
    where: { refresh_token: refreshToken },
  });
  if (!checkUser) {
    return next(new AppError("Invalid token", UNAUTHORIZED));
  }

  const accessToken = createAccessToken({
    uid: checkUser.uid,
  });

  return res.status(OK).json({
    message: "Token extended",
    data: {
      ...omitUser(checkUser),
      token: accessToken,
    },
  });
});

const generateRandomString = () => {
  let randomString = "";
  for (let i = 0; i < 6; i++) {
    randomString += crypto.randomInt(0, 9).toString();
  }
  return randomString;
};

const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await prisma.users.findFirst({
    where: { email },
  });
  if (!user) {
    return next(new AppError("Email not found", BAD_REQUEST));
  }

  const randomCode = generateRandomString();
  const expire_at = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes

  await prisma.code_forgot_password.create({
    data: {
      coid: uuidv4(),
      code: randomCode,
      expire_at,
      uid: user.uid,
    },
  });

  // config info mail
  const mailOptions = createMailForgotPassword(email, randomCode);
  // send mail
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return next(new AppError("Send mail failed", INTERNAL_SERVER));
    }
    return res.status(OK).json({
      message: "Send mail successfully",
    });
  });
});

const resetPassword = catchAsync(async (req, res, next) => {
  const { email, code, password } = req.body;

  const user = await prisma.users.findFirst({
    where: { email },
  });
  if (!user) {
    return next(new AppError("Email not found", BAD_REQUEST));
  }

  const checkCode = await prisma.code_forgot_password.findFirst({
    where: { code, uid: user.uid },
  });
  if (!checkCode) {
    return next(new AppError("Code is invalid", BAD_REQUEST));
  }

  const now = new Date();
  if (now > checkCode.expire_at) {
    return next(new AppError("Code is expired", BAD_REQUEST));
  }

  await prisma.users.update({
    where: { uid: user.uid },
    data: {
      password: bcrypt.hashSync(password, 10),
    },
  });

  await prisma.code_forgot_password.delete({
    where: { coid: checkCode.coid },
  });

  return res.status(OK).json({
    message: "Reset password successfully",
  });
});

export { register, login, extendToken, forgotPassword, resetPassword };

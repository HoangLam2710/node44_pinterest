import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import omit from "lodash/omit.js";
import bcrypt from "bcrypt";

import {
  BAD_REQUEST,
  CREATED,
  INTERNAL_SERVER,
  OK,
} from "../constant/error_code.js";
import { createAccessToken, createRefreshToken } from "../config/jwt.js";

const prisma = new PrismaClient();

const register = async (req, res) => {
  try {
    const { email, password, fullName, age, avatar } = req.body;

    const userExist = await prisma.users.findFirst({
      where: { email },
    });

    if (userExist) {
      return res.status(BAD_REQUEST).json({ message: "User already exists" });
    }

    const userNew = await prisma.users.create({
      data: {
        user_id: uuidv4(),
        email,
        password: bcrypt.hashSync(password, 10),
        full_name: fullName,
        age,
        avatar,
      },
    });

    return res.status(CREATED).json({
      message: "Register succesfully",
      data: omit(userNew, ["password", "refresh_token"]),
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER).json({ message: "error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.users.findFirst({
      where: { email },
    });
    if (!user) {
      return res.status(BAD_REQUEST).json({ message: "User not found" });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(BAD_REQUEST).json({ message: "Incorrect password" });
    }

    const accessToken = createAccessToken({ userId: user.user_id });
    const refreshToken = createRefreshToken({ userId: user.user_id });
    await prisma.users.update({
      where: { user_id: user.user_id },
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
      message: "Login succesfully",
      data: {
        ...omit(user, ["password", "refresh_token"]),
        token: accessToken,
      },
    });
  } catch (error) {
    console.log(error);

    return res.status(INTERNAL_SERVER).json({ message: "error" });
  }
};

export { register, login };

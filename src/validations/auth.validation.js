import { z } from "zod";
import { BAD_REQUEST } from "../constant/error_code.js";

const Register = z.object({
  email: z
    .string({
      invalid_type_error: "Invalid email",
      required_error: "Email is required",
    })
    .email({ message: "Invalid email format" }),
  password: z.string({ required_error: "Password is required" }),
  fullName: z.string({ required_error: "Full name is required" }),
  age: z
    .number({ invalid_type_error: "Invalid age" })
    .positive({ message: "Age must be greater than 0" })
    .int({ message: "Age must be an integer" })
    .optional(),
  avatar: z.string().url().optional(),
});

const registerValidation = (req, res, next) => {
  try {
    Register.parse(req.body);
    next();
  } catch (error) {
    return res.status(BAD_REQUEST).json({ message: error.errors[0].message });
  }
};

const Login = z.object({
  email: z
    .string({
      invalid_type_error: "Invalid email",
      required_error: "Email is required",
    })
    .email({ message: "Invalid email format" }),
  password: z.string({ required_error: "Password is required" }),
});

const loginValidation = (req, res, next) => {
  try {
    Login.parse(req.body);
    next();
  } catch (error) {
    return res.status(BAD_REQUEST).json({ message: error.errors[0].message });
  }
};

export { registerValidation, loginValidation };

import { z } from "zod";
import catchAsync from "../../utils/catch_async.js";

const Register = z.object({
  email: z
    .string({
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
});

const registerValidation = catchAsync((req, res, next) => {
  Register.parse(req.body);
  next();
});

const Login = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({ message: "Invalid email format" }),
  password: z.string({ required_error: "Password is required" }),
});

const loginValidation = catchAsync((req, res, next) => {
  Login.parse(req.body);
  next();
});

export { registerValidation, loginValidation };

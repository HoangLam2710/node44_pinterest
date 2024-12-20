import { z } from "zod";
import catchAsync from "../../utils/catch_async.js";

const UpdateAccount = z.object({
  fullName: z.string({ required_error: "Full name is required" }),
  age: z
    .number({ invalid_type_error: "Invalid age" })
    .positive({ message: "Age must be greater than 0" })
    .int({ message: "Age must be an integer" })
    .optional(),
  bio: z.string().optional(),
  website: z.string().url().optional(),
  userName: z.string({ required_error: "User name is required" }),
});

const updateAccountValidation = catchAsync((req, res, next) => {
  UpdateAccount.parse(req.body);
  next();
});

export { updateAccountValidation };

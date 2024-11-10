import { z } from "zod";
import catchAsync from "../../utils/catch_async.js";

const CreatePost = z.object({
  name: z.string({ required_error: "Name is required" }),
  imageUrl: z.string({ required_error: "Image url is required" }).url(),
  description: z.string().optional(),
  additionalWebsite: z.string().url().optional(),
});

const createPostValidation = catchAsync((req, res, next) => {
  CreatePost.parse(req.body);
  next();
});

const GetPosts = z.object({
  page: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (value) {
          const numberValue = Number(value);
          return !isNaN(numberValue) && numberValue > 0;
        }
        return true;
      },
      {
        message: "Page must be a number greater than 0",
      },
    ),
  perPage: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (value) {
          const numberValue = Number(value);
          return !isNaN(numberValue) && numberValue > 0;
        }
        return true;
      },
      {
        message: "Per page must be a number greater than 0",
      },
    ),
});

const getPostsValidation = catchAsync((req, res, next) => {
  GetPosts.parse(req.query);
  next();
});

export { createPostValidation, getPostsValidation };

import { z } from "zod";
import catchAsync from "../../utils/catch_async.js";

const CreatePost = z.object({
  imageUrl: z.string({ required_error: "Image url is required" }).url(),
  imageName: z.string({ required_error: "Image name is required" }),
  description: z.string().optional(),
  additionalWebsite: z.string().url().optional(),
});

const createPostValidation = catchAsync((req, res, next) => {
  CreatePost.parse(req.body);
  next();
});

export { createPostValidation };

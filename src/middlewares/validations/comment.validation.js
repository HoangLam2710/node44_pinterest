import { z } from "zod";
import catchAsync from "../../utils/catch_async.js";

const CreateComment = z.object({
  content: z.string({ required_error: "Content is required" }).refine(
    (value) => {
      return value.trim() !== "";
    },
    {
      message: "Content is required",
    },
  ),
});

const createCommentValidation = catchAsync((req, res, next) => {
  CreateComment.parse(req.body);
  next();
});

export { createCommentValidation };

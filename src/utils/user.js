import omit from "lodash/omit.js";

const omitUser = (user) => {
  return omit(user, ["password", "refresh_token"]);
};

const responseDataSuccess = (res, statusCode, message, data) => {
  return res.status(statusCode).json({
    message,
    data,
  });
};

export { omitUser, responseDataSuccess };

import omit from "lodash/omit.js";

const omitUser = (user) => {
  return omit(user, ["password", "refresh_token"]);
};

export { omitUser };

/**
 * @file jwt.utils.js
 * @description Utility helper for utils feature.
 */
import jsonwebtoken from "jsonwebtoken";
import env from "../config/env.js";
const signToken = (id) => {
  return jsonwebtoken.sign(
    {
      id,
    },
    env.JWT_SECRET,
    {
      expiresIn: "15m", // 15 minutes
    },
  );
};

const signRefreshToken = (id) => {
  return jsonwebtoken.sign(
    {
      id,
    },
    env.JWT_SECRET,
    {
      expiresIn: "7d", // 7 days
    },
  );
};

const verifyToken = (token) => {
  try {
    return jsonwebtoken.verify(token, env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

const verifyRefreshToken = (token) => {
  try {
    return jsonwebtoken.verify(token, env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export default { signToken, signRefreshToken, verifyToken, verifyRefreshToken };

export { signToken, signRefreshToken, verifyToken, verifyRefreshToken };

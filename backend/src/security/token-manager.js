import jwt from "jsonwebtoken";
import InvariantError from "../exceptions/invariant-error.js";

const TokenManager = {
  generateAccessToken: (payload) =>
    jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, {
      expiresIn: process.env.ACCESS_TOKEN_AGE,
    }),

  generateRefreshToken: (payload) =>
    jwt.sign(payload, process.env.REFRESH_TOKEN_KEY),

  verifyAccessToken: (accessToken) => {
    try {
      return jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY);
    } catch {
      throw new InvariantError("Access token tidak valid");
    }
  },

  verifyRefreshToken: (refreshToken) => {
    try {
      return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
    } catch {
      throw new InvariantError("Refresh token tidak valid");
    }
  },
};

export default TokenManager;

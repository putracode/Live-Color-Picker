import AuthenticationRepository from "../repositories/authentication-repository.js";
import AuthenticationError from "../../../exceptions/authentication-error.js";
import InvariantError from "../../../exceptions/invariant-error.js";
import TokenManager from "../../../security/token-manager.js";
import UserRepository from "../../users/repositories/UserRepository.js";
import response from "../../../utils/response.js";

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.validated;

    const user = await UserRepository.verifyCredentials(email, password);

    if (!user) {
      return next(new AuthenticationError("Email atau password salah"));
    }

    // Encode id dan role ke dalam token
    const accessToken = TokenManager.generateAccessToken({ id: user.id, role: user.role });
    const refreshToken = TokenManager.generateRefreshToken({ id: user.id, role: user.role });

    await AuthenticationRepository.createToken(refreshToken);

    return response(res, 200, "Login berhasil", { accessToken, refreshToken });
  } catch (error) {
    return next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.validated;

    const isValid = await AuthenticationRepository.verifyToken(refreshToken);
    if (!isValid) {
      return next(new InvariantError("Refresh token tidak valid"));
    }

    const { id, role } = TokenManager.verifyRefreshToken(refreshToken);
    const accessToken = TokenManager.generateAccessToken({ id, role });

    return response(res, 200, "Access token berhasil diperbarui", { accessToken });
  } catch (error) {
    return next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.validated;

    const isValid = await AuthenticationRepository.verifyToken(refreshToken);
    if (!isValid) {
      return next(new InvariantError("Refresh token tidak valid"));
    }

    await AuthenticationRepository.deleteToken(refreshToken);

    return response(res, 200, "Logout berhasil");
  } catch (error) {
    return next(error);
  }
};

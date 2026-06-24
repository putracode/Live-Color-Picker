import TokenManager from '../security/token-manager.js';
import { AuthorizationError, AuthenticationError } from '../exceptions/index.js';

/**
 * Middleware: verifikasi access token dari header Authorization
 */
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AuthenticationError('Token tidak ditemukan'));
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const payload = TokenManager.verifyAccessToken(token);
    req.user = payload;
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Middleware: hanya izinkan role admin
 */
export const authorizeAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return next(new AuthorizationError('Akses ditolak: hanya admin yang diizinkan'));
  }
  return next();
};

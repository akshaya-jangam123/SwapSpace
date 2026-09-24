import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export const generateToken = (userId: mongoose.Types.ObjectId | string, role: string): string => {
  const secret = process.env.JWT_SECRET || 'swapspace_super_secret_jwt_key_development_2026';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign({ id: userId.toString(), role }, secret, {
    expiresIn: expiresIn as any,
  });
};

import jwt from 'jsonwebtoken';
import config from '../config/config.js';

const createToken = payload => {
  return jwt.sign(payload, config.jwt.secret);
};

const verifyToken = token => {
  return jwt.verify(token, config.jwt.secret);
};

export const jwtHelpers = {
  createToken,
  verifyToken,
};

import * as simple from 'jwt-simple';
import {isSessionBool} from './auth';

export const guard = function guard (permissions: [string]) {
  return function expStack (req, res, next) {
    if (!req.cookies['access_token'] || !isSessionBool(req, res, next)) {
      return res.sendStatus(403);
    }

    let decoded = simple.decode(req.cookies['access_token'], process.env.JWT_SECRET);
    if (!decoded.permissions || decoded.permissions.length <= 0) {
      return res.sendStatus(403);
    }

    return permissions.every(
      (permission) => decoded.permissions.some((tokenPermission) => permission === tokenPermission))
      ? next() : res.sendStatus(403);
  };
};

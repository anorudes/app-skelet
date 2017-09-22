import { findSession, findUser } from '../sequelize/requests';

import winston from 'winston';

// Check user is logged

const getUserFromSession = (session, projectId, callback) => {
  session.getUser({
    scope: ['extended'],
  }).then(async user => {

    let returnUser = user.get({ plain: true });

    // Update session lastSeen
    session.set({ lastSeen: Date.now() });
    session.save();

    if (returnUser.parentId) {
      // If we have parent id, then
      // replace user info with user parent id (email)
      const userByParentId = await findUser('id', returnUser.parentId);
      if (userByParentId && !userByParentId.socialType) {
        returnUser = userByParentId.get({ plain: true });
      }
    }

    callback(returnUser);
  });
};

export const isAuthorized = (req, res, next) => {
  const token = req.headers.token || req.cookies.token;

  findSession(token).then(session => {
    if (!session || !session.loggedIn) {
      winston.warn(`isAuthorized error. Token ${token} is not found`);
      return res.json({ isAuthorized: false });
    }

    getUserFromSession(session, req.projectId, user => {
      req.userByToken = user;
      next();
    });
  });
};

// Check user is cat

export const isCat = (req, res, next) => {
  const token = req.headers.token || req.cookies.token;

  findSession(token).then(session => {
    if (!session || !session.loggedIn) {
      winston.warn(`isCat error. Token ${token} is not found`);
      return res.json({ isAuthorized: false });
    }

    getUserFromSession(session, req.projectId, user => {
      if (user && (user.userGroup === 'admin' || user.userGroup === 'cat')) {
        req.userByToken = user;
        next();
      } else {
        winston.warn(`isCat error. Permission denied. userGroup === ${user && user.userGroup}`);
        res.status(401).send('Authentication failed');
      }
    });
  });
};

// Check user is author

export const isAuthor = (req, res, next) => {
  const token = req.headers.token || req.cookies.token;

  findSession(token).then(session => {
    if (!session || !session.loggedIn) {
      winston.warn(`isAuthor error. Token ${token} is not found`);
      return res.json({ isAuthorized: false });
    }

    getUserFromSession(session, req.projectId, user => {
      if (user && (user.userGroup === 'admin' || user.userGroup === 'cat' || user.userGroup === 'author')) {
        req.userByToken = user;
        next();
      } else {
        winston.warn(`isAuthor error. Permission denied. userGroup === ${user && user.userGroup}`);
        res.status(401).send('Authentication failed');
      }
    });
  });
};

// Check user is admin

export const isAdmin = (req, res, next) => {
  const { token } = req.headers;

  findSession(token).then(session => {
    if (!session || !session.loggedIn) {
      winston.warn(`isAdmin error. Token ${token} is not found`);
      return res.json({ isAuthorized: false });
    }

    getUserFromSession(session, req.projectId, user => {
      if (user && user.userGroup === 'admin') {
        req.userByToken = user;
        next();
      } else {
        winston.warn(`isAdmin error. Permission denied. userGroup === ${user && user.userGroup}`);
        res.status(401).send('Authentication failed');
      }
    });
  });
};

export const getUser = (req, res, next) => {
  let { token } = req.headers;
  if (!token) {
    token = req.cookies.token;
  }

  findSession(token).then(session => {
    if (!session || !session.loggedIn) { return next(); }

    getUserFromSession(session, req.projectId, user => {
      req.userByToken = user;
      next();
    });
  });
};

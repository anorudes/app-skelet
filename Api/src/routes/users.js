import Express from 'express';
import passport from 'passport';
import { getUser as getUserMiddleware } from '../middleware/auth';
import passportFacebookStrategy from '../middleware/passport/facebookStrategy';
import passportVkontakteStrategy from '../middleware/passport/vkontakteStrategy';
import passportGooglePlusStrategy from '../middleware/passport/googlePlusStrategy';
import passportTwitterStrategy from '../middleware/passport/twitterStrategy';
import passportSocialAuthorized from '../middleware/passport/authorized';


const Router = new Express.Router();

passport.initialize();

export default [
  // Auth by email and social
  // TODO:

  // Facebook
  passportFacebookStrategy,
  Router.get('/api/auth/facebook', passport.authenticate('facebook',
    { session: false, scope: ['email'] }),
  ),
  Router.get('/api/auth/facebook/redirect', getUserMiddleware, passport.authenticate('facebook', { session: false }),
    (...arg) => passportSocialAuthorized(...arg, 'facebook'),
  ),

  // Vkontakte
  passportVkontakteStrategy,
  Router.get('/api/auth/vkontakte', passport.authenticate('vkontakte',
    { session: false }),
  ),
  Router.get('/api/auth/vkontakte/redirect', getUserMiddleware, passport.authenticate('vkontakte', { session: false }),
    (...arg) => passportSocialAuthorized(...arg, 'vkontakte'),
  ),

  // Twitter
  passportTwitterStrategy,
  Router.get('/api/auth/twitter', passport.authenticate('twitter',
    { session: false }),
  ),
  Router.use('/api/auth/twitter/redirect', getUserMiddleware, passport.authenticate('twitter', { session: false }),
    (...arg) => passportSocialAuthorized(...arg, 'twitter'),
  ),

  // Google plus
  passportGooglePlusStrategy,
  Router.get('/api/auth/gplus', passport.authenticate('google', { scope: ['profile'] })),
  Router.use('/api/auth/gplus/redirect', getUserMiddleware, passport.authenticate('google', { session: false }),
    (...arg) => passportSocialAuthorized(...arg, 'gplus'),
  ),
];

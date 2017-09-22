import { getProjectConfig } from '../../../config';
import passportVkontakte from 'passport-vkontakte';
import passport from 'passport';

export default function passportVkStrategy(req, res, next) {
  const VKONTAKTE = getProjectConfig(req).PASSPORT.VKONTAKTE;

  passport.use(new passportVkontakte.Strategy({
    clientID: VKONTAKTE.id,
    clientSecret: VKONTAKTE.secret,
    callbackURL: `${req.oauthCallbackOrigin}/api/v1/auth/vkontakte/redirect`,
    scope: ['email'],
  }, function (accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }));

  next();
}

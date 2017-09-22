import { getProjectConfig } from '../../../config';
import passportFacebook from 'passport-facebook';
import passport from 'passport';

export default function passportFacebookStrategy(req, res, next) {
  const FACEBOOK = getProjectConfig(req).PASSPORT.FACEBOOK;

  passport.use(new passportFacebook.Strategy({
    clientID: FACEBOOK.id,
    clientSecret: FACEBOOK.secret,
    callbackURL: `${req.oauthCallbackOrigin}/api/v1/auth/facebook/redirect`,
    profileFields: ['id', 'first_name', 'last_name', 'email', 'picture'],
  }, function (accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }));

  next();
}

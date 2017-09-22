import { getProjectConfig } from '../../../config';
import PassportGoogleStrategy from 'passport-google-oauth20';
import passport from 'passport';

export default function passportGooglePlusStrategy(req, res, next) {
  const GOOGLE_PLUS = getProjectConfig(req).PASSPORT.GOOGLE_PLUS;

  passport.use(new PassportGoogleStrategy({
    clientID: GOOGLE_PLUS.id,
    clientSecret: GOOGLE_PLUS.secret,
    callbackURL: `${req.oauthCallbackOrigin}/api/v1/auth/gplus/redirect`,
  }, function (accessToken, refreshToken, profile, done) {
    done(null, profile);
  }));

  next();
}

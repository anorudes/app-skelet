import { getProjectConfig } from '../../../config';
import passportTwitter from 'passport-twitter';
import passport from 'passport';

export default function passportTwitterStrategy(req, res, next) {
  const TWITTER = getProjectConfig(req).PASSPORT.TWITTER;

  passport.use(new passportTwitter.Strategy({
    consumerKey: TWITTER.key,
    consumerSecret: TWITTER.secret,
    callbackURL: `${req.oauthCallbackOrigin}/api/v1/auth/twitter/redirect`,
  }, function (accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }));

  next();
}

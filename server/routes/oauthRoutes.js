import express from 'express';
import passport from 'passport';
import { googleAuthCallback } from '../controllers/oauthRoutes';

const oauthRouter = express.Router();

oauthRouter.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);

oauthRouter.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false,
  }),
  googleAuthCallback,
);

export default oauthRouter;

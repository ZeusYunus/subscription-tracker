import { Router } from 'express';

import { signIn, signUp } from '../controllers/auth.controller.js';

const authRouter = Router();

// Path: /api/v1/auth/sign-up (POST)
// -> /api/v1/auth/sign-up -> POST BODY -> { name, email, password } -> CREATE USER -> RETURN JWT TOKEN
authRouter.post('/sign-up', signUp);

authRouter.post('/sign-in', signIn);

// authRouter.post('/sign-out', signOut);

export default authRouter;
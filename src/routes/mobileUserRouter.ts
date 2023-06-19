import express from 'express';
const router = express.Router();
import { checkToken } from '../middlewares/token';
import { readAll, authenticateMobileUser, signupMobileUser, mobileUserLogin, verifyMobileUserOtp, mobileUserLogout } from '../controllers/mobileUserContoller';

router.post('/authenticateUser', authenticateMobileUser);

router.post('/verifyOtp', verifyMobileUserOtp);

router.post('/signup', signupMobileUser);

router.get('/login', mobileUserLogin);

router.post('/logout',checkToken, mobileUserLogout);

router.get('/loadallmobileusers', checkToken, readAll);

export default router
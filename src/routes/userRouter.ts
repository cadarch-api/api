import express from 'express';
const router = express.Router();
import { checkToken } from '../middlewares/token';
import { readAll, authenticateUser,updateProfile, updatePassword, generateOtp, verifyOtp, resetPassword } from '../controllers/userController';
import { getUpload } from "../config/multerHelper";
const upload = getUpload("user");
router.post('/login', authenticateUser);
router.post('/forgotpassword', generateOtp);
router.post('/verifyotp', verifyOtp);

router.post('/login', authenticateUser);
router.patch("/updateprofile", checkToken, async (req: any, res: any) => {
    upload(req, res, async (err: any) => {
      if (err) {
        return res.json({
          responseCode: 0,
          responseStatus: "error",
          responseMessage: "Error occured while uploading files",
          data: {},
        });
      }
      await updateProfile(req,res);
    });
  });

router.patch('/resetpassword', resetPassword);
router.patch('/changepassword', updatePassword);
router.get('/all', checkToken, readAll);


export default router
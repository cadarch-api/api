// server/controllers/userController.js
import { Request, Response } from "express";
import { encryptPassword, verifyPassword } from '../config/encrypt';
import { MobileUser, MobileUserInterface } from "../models/modileUserModel";
import { GenericController } from './generic';
import {
    authenticateMobileUserUtil,
    getAllMobileUsersUtil,
    signUpMobileUserUtil,
    loginMobileUser,
    verifyMobileUserOtpUtil,
    logoutUtil
} from "../utils/mobileUserUtil";

const readAll = async (req: Request, res: Response) => {
    try {
        let usersList = await getAllMobileUsersUtil();
        res.json(usersList);
    }
    catch (error) {
        console.log(error);
    }
}

const authenticateMobileUser = async (req: Request, res: Response) => {
    try {
        if (req.body && req.body.phoneNumber && req.body.phoneNumber != null) {
            const model: MobileUserInterface = req.body;
            let response = await authenticateMobileUserUtil(model);
            res.json(response);
        }
    }
    catch (ex) {
        res.json(ex);
    }
}

const verifyMobileUserOtp = async (req: Request, res: Response) => {

    if (req.body && req.body.phoneNumber && req.body.phoneOtp) {

        let model: MobileUserInterface = req.body;
        let response = await verifyMobileUserOtpUtil(model);
        return res.json(response);
    } else {
        return res.json({
            success: false,
            message: "OTP did not match"
        })
    }

}

const signupMobileUser = async (req: Request, res: Response) => {

    if (req.body && req.body.phoneNumber && req.body.fullName) {
        let model: MobileUserInterface = req.body;
        let response = await signUpMobileUserUtil(model);
        return res.json(response);
    }
    else {
        return res.json({
            success: false,
            message: "Please provide name and number"
        })
    }

}

const mobileUserLogin = async (req: Request, res: Response) => {
    if (req.body && req.body.phoneNumber) {
        let response = await loginMobileUser(req.body.phoneNumber);
        res.json(response)
    }
}

const mobileUserLogout = async (req: Request, res: Response) => {
    if (req.body && req.body.id) {
        let response = await logoutUtil(req.body.id);
        res.json(response)
    }
}

export { readAll, authenticateMobileUser, verifyMobileUserOtp, signupMobileUser, mobileUserLogin,mobileUserLogout }
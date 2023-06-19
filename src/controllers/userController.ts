// server/controllers/userController.js
import { Request, Response } from "express";
import { encryptPassword, verifyPassword } from '../config/encrypt';
import { User, UserInterface } from "../models/userModel";
import { authenticateUserUtil, generateOtpUserUtil, getAllUsers, resetPasswordUtil, updatePasswordUtil, updateProfileUtil, verifyOtpUserUtil} from "../utils/userUtil";
import { GenericController } from './generic';
// import { checkToken } from '../middlewares/token';
const readAll = async (req: Request, res: Response) => {

  try {
    let usersList = await getAllUsers();
    res.json(usersList);
  } catch (error) {
    console.log(error);
  }
}


const authenticateUser = async (req: Request, res: Response) => {
  try {
    if (req.body) {
      const model: UserInterface = req.body;
      let response = await authenticateUserUtil(model);
      res.json(response);
    }
  }
  catch (ex) { res.json(ex); }
}
const updateProfile = async (req: Request, res: Response) => {
  try {
    if (req.body) {
      const model: UserInterface = JSON.parse(req.body.model);
      let response = await updateProfileUtil(req,model);
      res.json(response);
    }
  }
  catch (ex) { res.json(ex); }
}
const updatePassword = async (req: Request, res: Response) => {
  try {
    if (req.body) {
      const model: any = req.body.model;
      let response = await updatePasswordUtil(req,model);
      res.json(response);
    }
  }
  catch (ex) { res.json(ex); }
}

const generateOtp = async (req: Request, res: Response) => {
  try {
    if (req.body) {
      const model: any = req.body.model;
      let response = await generateOtpUserUtil(model);
      res.json(response);
    }
  }
  catch (ex) { res.json(ex); }
}
const verifyOtp = async (req: Request, res: Response) => {
  try {
    if (req.body) {
      const model: any = req.body.model;
      let response = await verifyOtpUserUtil(model);
      res.json(response);
    }
  }
  catch (ex) { res.json(ex); }
}

const resetPassword = async (req: Request, res: Response) => {
  try {
    if (req.body) {
      const model: any = req.body.model;
      let response = await resetPasswordUtil(model);
      res.json(response);
    }
  }
  catch (ex) { res.json(ex); }
}

export { readAll, authenticateUser,updateProfile,updatePassword,generateOtp,verifyOtp,resetPassword}


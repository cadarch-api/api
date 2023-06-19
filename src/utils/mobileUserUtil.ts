import { convertToObject, findConfigFile } from "typescript";
import { GenericController } from "../controllers/generic";
import { verifyPassword, encryptPassword } from "../config/encrypt";
import { MobileUser, MobileUserInterface } from "../models/modileUserModel";
import { ResponseInterface } from "../models/responseModel";
import { sendOtp } from "../config/twilio";

export async function getAllMobileUsersUtil() {
    try {
        let mobileUsers = await MobileUser.find();
        if (mobileUsers) {
            let response: ResponseInterface = {
                responseCode: 1,
                responseStatus: "success",
                responseMessage: 'List of mobile users',
                data: {
                    data: mobileUsers
                }
            }
            return response
        }
        else {
            let response: ResponseInterface = {
                responseCode: 1,
                responseStatus: "success",
                responseMessage: 'Error occurred',
                data: {}
            }
            return response
        }
    }
    catch (ex) {
        let response: ResponseInterface = {
            responseCode: 0,
            responseStatus: "error",
            responseMessage: 'Error occurred',
            data: { data: ex }
        }
        return response
    }
}

export async function authenticateMobileUserUtil(model: MobileUserInterface) {

    try {
        if (model && model.phoneNumber) {
            //send opt code will go here
            let otp = Math.floor(1000 + Math.random() * 9000).toString();
            model.phoneOtp = otp;

            // let user=new MobileUser(model);
            const countDocs = await MobileUser.countDocuments()
            const existingUserCheck = await MobileUser.findOne({phoneNumber: model.phoneNumber})
            // console.log(countDocs , " ----- " , existingUserCheck)
            if(!existingUserCheck){ 
                model.serialNO = `${countDocs+1}`
            }
            const updatedUser = await MobileUser.findOneAndUpdate({ phoneNumber: model.phoneNumber }, model, {new:true , upsert:!existingUserCheck ?true :false});
            // console.log(updatedUser , " :updated user")
            if (updatedUser) {
                const sendMessage = await sendOtp(model.phoneNumber.toString() , otp)
                if(!sendMessage){
                    console.log('twilio error')
                    let response: ResponseInterface = {
                        responseCode: 0,
                        responseStatus: "failure",
                        responseMessage: "something went wrong",
                        data: {}
                    };
                    return response
                }
                let response: ResponseInterface = {
                    responseCode: 1,
                    responseStatus: "success",
                    responseMessage: "OTP sent successfully",
                    data: { data: updatedUser }
                };
                return response
            }
        }
        else {
            let response: ResponseInterface = {
                responseCode: 0,
                responseStatus: "error",
                responseMessage: 'Model does not exist',
                data: {}
            }
            return response
        }
    }
    catch (ex) {

        let response: ResponseInterface = {
            responseCode: 0,
            responseStatus: "error",
            responseMessage: 'Error occurred',
            data: {}
        }
        return response;
    }
}

export async function verifyMobileUserOtpUtil(model: MobileUserInterface) {

    try {
        if (model) {

            let user: MobileUserInterface = await MobileUser.findOne({ phoneNumber: model.phoneNumber });
            if (model.phoneOtp == user.phoneOtp) {
                model.phoneOtp = "####";

                const options = { new: true }
                const updatedUser: MobileUserInterface = await MobileUser.findOneAndUpdate({ phoneNumber: model.phoneNumber }, model, options);
                let tokenController = new GenericController();
                const token = tokenController.generateTokenForMobileUser(updatedUser);
                if (updatedUser && token) {
                    let response: ResponseInterface = {
                        responseCode: 1,
                        responseStatus: "success",
                        responseMessage: 'User saved successfully',
                        data: {
                            user: updatedUser,
                            token: token
                        }
                    }
                    return response
                }
                else {
                    let response: ResponseInterface = {
                        responseCode: 0,
                        responseStatus: "error",
                        responseMessage: 'Error occurred while saving user',
                        data: {}
                    }
                    return response
                }
            }
            else {
                let response: ResponseInterface = {
                    responseCode: 0,
                    responseStatus: "error",
                    responseMessage: 'Otp does not verified',
                    data: {}
                }
                return response
            }
        }
    }
    catch (ex) {
        let response: ResponseInterface = {
            responseCode: 0,
            responseStatus: "error",
            responseMessage: 'Error occurred',
            data: { data: ex }
        }
        return response
    }
}

export async function signUpMobileUserUtil(model: MobileUserInterface) {

    try {
        if (model) {
            let user: MobileUserInterface = await MobileUser.findOne({ phoneNumber: model.phoneNumber });
            if (user.phoneOtp == "####") {
                user.fullName = model.fullName
                user.fcmToken = model.fcmToken
                user.address = model.address
                // let newUser = new MobileUser(user);
                // const updatedUser = await newUser.findOneAndUpdate();
                const options = { new: true }
                const updatedUser = await MobileUser.findOneAndUpdate({ phoneNumber: model.phoneNumber }, user, options);
                if (updatedUser) {
                    let response: ResponseInterface = {
                        responseCode: 1,
                        responseStatus: "success",
                        responseMessage: 'User saved successfully',
                        data: { user: updatedUser }
                    }
                    return response
                }
                else {
                    let response: ResponseInterface = {
                        responseCode: 0,
                        responseStatus: "error",
                        responseMessage: 'Error occurred while saving user',
                        data: {}
                    }
                    return response
                }
            }
            else {
                let response: ResponseInterface = {
                    responseCode: 0,
                    responseStatus: "error",
                    responseMessage: 'Otp does not match',
                    data: {}
                }
                return response
            }
        }
    }
    catch (ex) {
        let response: ResponseInterface = {
            responseCode: 0,
            responseStatus: "error",
            responseMessage: 'Error occurred',
            data: { data: ex }
        }
        return response
    }
}

export async function loginMobileUser(phoneNumber: string) {
    try {
        if (phoneNumber && phoneNumber != null) {
            let existingUser = await MobileUser.findOne({ phoneNumber: phoneNumber });
            if (existingUser && existingUser.phoneOtp == "####") {
                let response: ResponseInterface = {
                    responseCode: 1,
                    responseStatus: "success",
                    responseMessage: 'User is logged in',
                    data: {
                        users: existingUser
                    }
                }
                return response
            }
            else {
                let response: ResponseInterface = {
                    responseCode: 0,
                    responseStatus: "error",
                    responseMessage: 'User otp is empty',
                    data: {}
                }
                return response
            }
        }
    }
    catch (ex) {
        let response: ResponseInterface = {
            responseCode: 0,
            responseStatus: "error",
            responseMessage: 'Error occurred',
            data: { data: ex }
        }
        return response
    }
}

export const logoutUtil = async(id:string)=>{
if(id){
    const logout = await MobileUser.findOneAndUpdate({_id:id},{fcmToken:"#"},{new:true})
    if(logout){
        let response: ResponseInterface = {
            responseCode: 1,
            responseStatus: "success",
            responseMessage: 'Logged out successfully',
            data: {}
        }
        return response
    }
    else{
        let response: ResponseInterface = {
            responseCode: 0,
            responseStatus: "error",
            responseMessage: 'Error occurred',
            data: {}
        }
        return response
    }
}
console.log('id is missing')
return
}
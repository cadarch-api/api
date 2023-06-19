import { verifyPassword, encryptPassword } from "../config/encrypt";
import { User, UserInterface } from "../models/userModel";
import { GenericController } from "../controllers/generic";
import { ResponseInterface } from "../models/responseModel";
import { truncate } from "fs/promises";
import { sendOtp } from "../config/twilio";

export async function authenticateUserUtil(model: UserInterface) {
  if (model.email && model.password) {
    const user: UserInterface = await User.findOne({
      email: model.email,
      IsActive: true,
      // otp:'####'
    });
    if (user) {
      const isVerified = await verifyPassword(model.password, user.password);
      if (isVerified) {
        let tokenController = new GenericController();
        const token = tokenController.generateTokenForUser(user);
        if (token) {
          user.password = null;
          console.log("Successfully login");
          let response: ResponseInterface = {
            responseCode: 1,
            responseStatus: "success",
            responseMessage: "Authentication successful!",
            data: {
              token: token,
              user: user,
            },
          };
          return response;
        }
      } else {
        let response: ResponseInterface = {
          responseCode: 0,
          responseStatus: "error",
          responseMessage: "Password verification failed",
          data: {},
        };
        return response;
      }
    } else {
      let response: ResponseInterface = {
        responseCode: 0,
        responseStatus: "error",
        responseMessage: "No user found",
        data: {},
      };
      return response;
    }
  } else {
    let response: ResponseInterface = {
      responseCode: 0,
      responseStatus: "error",
      responseMessage: "Please provide username and password",
      data: {},
    };
    return response;
  }
}

export async function getAllUsers() {
  let users = await User.find();
  if (users) {
    let response: ResponseInterface = {
      responseCode: 1,
      responseStatus: "success",
      responseMessage: "List of all users",
      data: {
        users: users,
      },
    };
    return response;
  } else {
    let response: ResponseInterface = {
      responseCode: 0,
      responseStatus: "error",
      responseMessage: "Error occurred",
      data: {},
    };
    return response;
  }
}

export async function updateProfileUtil(req:any , model:any){
  if(req.files.length > 0){
    model.profilePhoto = req.files[0].path
  }
  if (model) {
    let res = await User.findOneAndUpdate({ _id: req.query.id }, model,{new:true});
    if (res) {
      let response: ResponseInterface = {
        responseCode: 1,
        responseStatus: "success",
        responseMessage: "profile updated successfully",
        data: res
      };
      return response;
    } else {
      let response: ResponseInterface = {
        responseCode: 0,
        responseStatus: "error",
        responseMessage: "Failed to update profile",
        data: {},
      };
      return response;
    }
  } else {
    return {
      responseCode: 0,
      responseStatus: "error",
      responseMessage: "Model doesn't exist",
      data: {},
    };
  }
}

export async function updatePasswordUtil(req:any , model:any){
  console.log('change password util')
  if (model) {
    let res = await User.findOne({ _id: req.query.id });
    if (res) {
      let passwordCheck = await verifyPassword(model.OldPassword , res.password)
      if(passwordCheck){
        if(model.NewPassword === model.ConfirmPassword){
          const password = await encryptPassword(model.NewPassword)
          let result = await User.findOneAndUpdate({ _id: req.query.id },{password : password},{new:true});
          if(result){
            let response: ResponseInterface = {
              responseCode: 1,
              responseStatus: "success",
              responseMessage: "password updated successfully",
              data: res
            };
            return response;
          }
          else{
            let response: ResponseInterface = {
              responseCode: 0,
              responseStatus: "error",
              responseMessage: "Failed to update password",
              data: {},
            };
            return response;
          }
        }
        else{
          let response: ResponseInterface = {
            responseCode: 0,
            responseStatus: "error",
            responseMessage: "passwords dont match",
            data: {},
          };
          return response;
        }
      }
      else{
        let response: ResponseInterface = {
          responseCode: 0,
          responseStatus: "error",
          responseMessage: "wrong password",
          data: {},
        };
        return response;
      }
    
    } else {
      let response: ResponseInterface = {
        responseCode: 0,
        responseStatus: "error",
        responseMessage: "Failed to update password",
        data: {},
      };
      return response;
    }
  } else {
    return {
      responseCode: 0,
      responseStatus: "error",
      responseMessage: "Model doesn't exist",
      data: {},
    };
  }
}



export async function generateOtpUserUtil(model: UserInterface) {

  try {
      if (model && model.cellPhone) {
          //send opt code will go here
          const user = await User.findOne({ cellPhone: model.cellPhone });
          if(!user){
            let response: ResponseInterface = {
              responseCode: 0,
              responseStatus: "failure",
              responseMessage: "phone number not found",
              data: {}
          };
          return response
          }
          let otp = Math.floor(1000 + Math.random() * 9000).toString();

          model.otp = otp;
          const sendMessage = await sendOtp(model.cellPhone , otp)
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
          const updatedUser = await User.findOneAndUpdate({ cellPhone: model.cellPhone }, model, {new:true});
          if (updatedUser) {
              
              let response: ResponseInterface = {
                  responseCode: 1,
                  responseStatus: "success",
                  responseMessage: "Otp has been sent to your number",
                  data:  updatedUser 
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

export async function verifyOtpUserUtil(model: UserInterface) {

  try {
      if (model) {
          let user: UserInterface = await User.findOne({ cellPhone: model.cellPhone });
          if(user.otp === null || user.otp === undefined){
            let response: ResponseInterface = {
              responseCode: 0,
              responseStatus: "error",
              responseMessage: 'OTP expired please try again',
              data: {}
          }
          return response
          }
          else{
            if (model.otp === user.otp) {
              model.otp = "####";

              // const options = { new: true, upsert: true, overwrite: true, }
              const updatedUser: UserInterface = await User.findOneAndUpdate({ phoneNumber: model.cellPhone }, {otp:model.otp}, {new:true});
              if (updatedUser) {
                  let response: ResponseInterface = {
                      responseCode: 1,
                      responseStatus: "success",
                      responseMessage: 'OTP verified',
                      data: {
                        
                      }
                  }
                  return response
              }
              else {
                  let response: ResponseInterface = {
                      responseCode: 0,
                      responseStatus: "error",
                      responseMessage: 'verification failed',
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


export async function resetPasswordUtil(model:any){
  console.log('reset password util')
  if (model) {
        if(model.NewPassword === model.ConfirmPassword){
          const password = await encryptPassword(model.NewPassword)
          let result = await User.findOneAndUpdate({ cellPhone: model.cellPhone },{password : password},{new:true});
          if(result){
            let response: ResponseInterface = {
              responseCode: 1,
              responseStatus: "success",
              responseMessage: "password updated successfully",
              data: result
            };
            return response;
          }
          else{
            let response: ResponseInterface = {
              responseCode: 0,
              responseStatus: "error",
              responseMessage: "Failed to update password",
              data: {},
            };
            return response;
          }
        }
        else{
          let response: ResponseInterface = {
            responseCode: 0,
            responseStatus: "error",
            responseMessage: "passwords dont match",
            data: {},
          };
          return response;
        }
      }
    
   else {
    return {
      responseCode: 0,
      responseStatus: "error",
      responseMessage: "Failed to update password",
      data: {},
    };
  }
}
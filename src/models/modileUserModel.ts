import mongoose from "mongoose";

interface MobileUserInterface {
    serialNO:string,
    fullName: string
    phoneNumber: number
    phoneOtp: string
    address:string
    isActive: boolean
    isDeleted:boolean
    fcmToken:string
}
// Create Schema
const MobileUserSchema = new mongoose.Schema(
    {
        serialNO:String,
        fullName: {
            type: String,
            required: false,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        phoneOtp: {
            type: String,
            required: false
        },
        address:{
            type:String,
          },
        isActive: {
            type: Boolean,
            required: false,
            default: true
        },
        isDeleted:{
            type:Boolean,
            default:false
          },
        fcmToken:{
            type:String,
        }
    },
    { timestamps: { createdAt: true, updatedAt: true } }
);

export interface MobileCredentialsInterface {
    fullName: String;
    phoneNumber: String;
}
const MobileUser = mongoose.model('MobileUser', MobileUserSchema);

export { MobileUser, MobileUserInterface }
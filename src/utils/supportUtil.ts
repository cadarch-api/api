
import mongoose from 'mongoose';
import { ResponseInterface } from '../models/responseModel';
import { SupportInterface, Support } from '../models/supportModel';

export async function addSupportUtil(model: SupportInterface) {
    if (model) {
        console.log(model)
        const newModel = new Support(model);
        let res = await newModel.save();
        if (res) {
            let response: ResponseInterface = {
                responseCode: 1,
                responseStatus: "success",
                responseMessage: "Support saved successfully",
                data: { data: res },
            };
            return response;
        }
        else {
            let response: ResponseInterface = {
                responseCode: 0,
                responseStatus: "error",
                responseMessage: "Failed to save support model",
                data: {},
            };
            return response;
        }

    }
    else {
        return {
            responseCode: 0,
            responseStatus: "error",
            responseMessage: "Model doesn't exist",
            data: {},
        };
    }
}

export async function readAllSupportUtil() {

    let res = await Support.find({isDeleted:false}).populate({
        path: 'userId',
        select: { fullName: 1, email: 1, phoneNo:1 ,_id: 0 },
    })
    .sort({createdAt:-1})
    if (res) {
        let response: ResponseInterface = {
            responseCode: 1,
            responseStatus: "success",
            responseMessage: "List of all Support messages",
            data: { data: res },
        };
        return response;
    }
    else {
        let response: ResponseInterface = {
            responseCode: 1,
            responseStatus: "error",
            responseMessage: 'Error occurred',
            data: {}
        }
        return response;
    }
}

export async function deleteOneSupportUtil(id:string) {
    if (id) {
        const newModel = await Support.findOneAndUpdate({_id:new mongoose.Types.ObjectId(id)},{isDeleted:true},{new:true});
        if (newModel) {
            let response: ResponseInterface = {
                responseCode: 1,
                responseStatus: "success",
                responseMessage: "support message deleted successfully",
                data: { data: newModel },
            };
            return response;
        }
        else {
            let response: ResponseInterface = {
                responseCode: 0,
                responseStatus: "error",
                responseMessage: "Failed to delete support message model",
                data: {},
            };
            return response;
        }
    }
    else {
        return {
            responseCode: 0,
            responseStatus: "error",
            responseMessage: "Model doesn't exist",
            data: {},
        };
    }
}

export async function filterSupportUtil(filter:string) {
    if (filter) {
        console.log(filter , " :filter value")
        const newModel = await Support.find({ $or: [{ email:filter},{name:filter},{type:{$eq:filter}},{userId:new mongoose.Types.ObjectId(filter)}]}).populate({
            path: 'userId',
            select: { fullName: 1, email: 1, phoneNo:1 ,_id: 0 },
        });
        if (newModel) {
            let response: ResponseInterface = {
                responseCode: 1,
                responseStatus: "success",
                responseMessage: "support message filtered successfully",
                data: { data: newModel },
            };
            return response;
        }
        else {
            let response: ResponseInterface = {
                responseCode: 0,
                responseStatus: "error",
                responseMessage: "Failed to filter support message model",
                data: {},
            };
            return response;
        }
    }
    else {
        return {
            responseCode: 0,
            responseStatus: "error",
            responseMessage: "Model doesn't exist",
            data: {},
        };
    }
}

import mongoose from 'mongoose';
import { ResponseInterface } from '../models/responseModel';
import { BasePriceInterface, BasePrice } from '../models/basePriceModel';

export async function addBasePriceUtil(model: BasePriceInterface) {
    if (model) {
        console.log(model)
        const newModel = new BasePrice(model);
        let res = await newModel.save();
        if (res) {
            let response: ResponseInterface = {
                responseCode: 1,
                responseStatus: "success",
                responseMessage: "Base Price added successfully",
                data: res,
            };
            return response;
        }
        else {
            let response: ResponseInterface = {
                responseCode: 0,
                responseStatus: "error",
                responseMessage: "Failed to add basePrice",
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

export async function readAllBasePriceUtil() {

    let res = await BasePrice.find({ isDeleted: false })
        .sort({ createdAt: -1 })
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

export async function deleteOneBasePriceUtil(id: string) {
    if (id) {
        const newModel = await BasePrice.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, { isDeleted: true }, { new: true });
        if (newModel) {
            let response: ResponseInterface = {
                responseCode: 1,
                responseStatus: "success",
                responseMessage: "Base Price deleted successfully",
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

export async function toggleBasePriceUtil(id: string, value: any) {
    if (id && value) {
        const alreadyPresent = await BasePrice.findOne({ isActive: true, isDeleted: false })
        if(alreadyPresent){
            const checkTrue = await BasePrice.findOneAndUpdate({ _id : alreadyPresent._id }, { isActive: false } , {new:true})
         }
            const newModel = await BasePrice.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, { isActive: value })
            if (newModel) {
                let response: ResponseInterface = {
                    responseCode: 1,
                    responseStatus: "success",
                    responseMessage: "toggeled successfully",
                    data: newModel,
                };
                return response;
            }
            else {
                let response: ResponseInterface = {
                    responseCode: 0,
                    responseStatus: "error",
                    responseMessage: "Failed to toggle",
                    data: {},
                };
                return response;
            }
        } 
        else {
            let response: ResponseInterface = {
                responseCode: 0,
                responseStatus: "error",
                responseMessage: "Params Missing",
                data: {},
            };
            return response;
        }
}
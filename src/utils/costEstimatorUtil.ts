import { CostEstimatorInterface, CostEstimator } from '../models/costEstimatorModel';
import { ResponseInterface } from '../models/responseModel';
import mongoose from 'mongoose'

export async function addCostEstimatorUtil(model: CostEstimatorInterface) {
    if (model) {
        const newModel = new CostEstimator(model);
        let res = await newModel.save();
        if (res) {
            let response: ResponseInterface = {
                responseCode: 1,
                responseStatus: "success",
                responseMessage: "Cost Estimator saved successfully",
                data: { data: res },
            };
            return response;
        }
        else {
            let response: ResponseInterface = {
                responseCode: 0,
                responseStatus: "error",
                responseMessage: "Failed to save Cost Estimator model",
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


export async function readAllCostEstimatorUtil(req: any, res: any) {
    try {
        let costEstimation: CostEstimatorInterface[] = await CostEstimator.find({ isDeleted: false }
            // { userId: req.query.userId }, 
            // { 'details._id': 0, '__v': 0 }
        )
            .populate({
                path: 'userId',
                select: { fullName: 1, phoneNumber: 1, _id: 0 },
            })
            .populate({
                path: 'details.optionId',
                select: { title: 1, details: 1, _id: 0 },
            })
            .populate({
                path: 'details.questionId',
                select: { title: 1, details: 1, _id: 0 },
            })
        if (costEstimation) {
            let response: ResponseInterface = {
                responseCode: 1,
                responseStatus: "success",
                responseMessage: "List of all Cost Estimator",
                data: { data: costEstimation },
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
    } catch (error) { console.log(error) }

}

export async function deleteOneCostEstimatorUtil(req: any) {
    if (req.query.id) {
        const newModel = await CostEstimator.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(req.query.id) }, { isDeleted: true }, { new: true });
        if (newModel) {
            let response: ResponseInterface = {
                responseCode: 1,
                responseStatus: "success",
                responseMessage: "Cost Estimator deleted successfully",
                data: { data: newModel },
            };
            return response;
        }
        else {
            let response: ResponseInterface = {
                responseCode: 0,
                responseStatus: "error",
                responseMessage: "Failed to delete Cost Estimator model",
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


export async function readOneCostEstimatorUtil(req: any, res: any) {
    try {

        // let questions: QuestionInterface[] = await Question.find({ where: { IsActive: true, costEstimatorId: req.params.id }, raw: true }).exec();

        // let options: QuestionOptionInterface[] = await QuestionOption.find({ where: { IsActive: true }, raw: true }).exec();

        // let questionsWithOptions: QuestionViewInterface[] = [];

        // // questions && questions.forEach((question, i) => {
        // //     let questionsWithOption: QuestionViewInterface = Object();
        // //     questionsWithOption = question;
        // //     questionsWithOption.questionOptions = [];
        // //     let filteredOptions = options && options.filter((op) => question.costEstimatorId == op.questionId);
        // //     questionsWithOption.questionOptions.push(...filteredOptions);

        // //     questionsWithOptions.push(questionsWithOption);
        // // })

        // if (questionsWithOptions) {
        //     let response: ResponseInterface = {
        //         responseCode: 1,
        //         responseStatus: "success",
        //         responseMessage: "List of all Cost Estimator",
        //         data: { data: questionsWithOptions },
        //     };
        //     return response;
        // }
        // else {
        //     let response: ResponseInterface = {
        //         responseCode: 1,
        //         responseStatus: "error",
        //         responseMessage: 'Error occurred',
        //         data: {}
        //     }
        //     return response;
        // }
    } catch (error) { console.log(error) }

}

// export async function deleteOneCostEstimatorUtil(req: any, res: any, model: CostEstimatorInterface) { }

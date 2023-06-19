import fs from "fs";
import { Attachment } from "../models/attachmentModel";
import { ResponseInterface } from "../models/responseModel";
import {
  QuestionOptionInterface,
  QuestionOption,
} from "../models/questionOptionModel";
import {
  QuestionInterface,
  QuestionViewInterface,
  Question,
} from "../models/questionModel";
import { Dependencies } from "../models/dependenciesModel";
import mongoose from "mongoose";

export async function addQuestionOptionUtil(
  req: any,
  res: any,
  model: QuestionOptionInterface
) {
  if (model) {
    let imageId = [];
    if (req && req.files && req.files.length != 0) {
      for (let i = 0; i < req.files.length; i++) {
        imageId.push(req.files[i].path);
      }
    }
    model.image = imageId;
    const newModel = new QuestionOption(model);
    console.log("model", model);
    let res = await newModel.save();
    if (res) {
      let response: ResponseInterface = {
        responseCode: 1,
        responseStatus: "success",
        responseMessage: "Question option saved successfully",
        data: { data: res },
      };
      return response;
    } else {
      let response: ResponseInterface = {
        responseCode: 0,
        responseStatus: "error",
        responseMessage: "Failed to save Cost Estimator option",
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

export async function updateQuestionOptionUtil(
  req: any,
  res: any,
  model: QuestionOptionInterface
) {
  if (model) {
    let imageId = [];
    if (req && req.files && req.files.length != 0) {
      const oldOption = await QuestionOption.findOne(
        { _id: req.query.id },
        { image: 1 }
      );
      if (oldOption && oldOption.image) {
        for (let j = 0; j < oldOption.image.length; j++) {
          fs.unlink(oldOption.image[j], function (err) {
            if (err) {
              let response: ResponseInterface = {
                responseCode: 1,
                responseStatus: "error",
                responseMessage: "Error occurred",
                data: { data: null },
              };
              return response;
            }
          });
        }
      }
      for (let i = 0; i < req.files.length; i++) {
        imageId.push(req.files[i].path);
      }
      model.image = imageId;
    }
    let res = await QuestionOption.findOneAndUpdate(
      { _id: req.query.id },
      model,
      { new: true }
    );

    if (res) {
      let response: ResponseInterface = {
        responseCode: 1,
        responseStatus: "success",
        responseMessage: "Question option updated successfully",
        data: { data: res },
      };
      return response;
    } else {
      let response: ResponseInterface = {
        responseCode: 0,
        responseStatus: "error",
        responseMessage: "Failed to save Cost Estimator option",
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

export async function readAllQuestionOptionUtil(req: Request, res: Response) {
  try {
    let options: QuestionOptionInterface[] = await QuestionOption.find({
      IsActive: true,
      isDeleted: false,
    });
    // let options: QuestionOptionInterface[] = await QuestionOption.find({ IsActive: true }).sort({ createdAt: 1 });

    if (options) {
      let response: ResponseInterface = {
        responseCode: 1,
        responseStatus: "success",
        responseMessage: "List of all options",
        data: { data: options },
      };
      return response;
    } else {
      let response: ResponseInterface = {
        responseCode: 1,
        responseStatus: "error",
        responseMessage: "Error occurred",
        data: {},
      };
      return response;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function readOneQuestionOptionUtil(req: any, res: any) {
  try {
    let options: QuestionOptionInterface[] = await QuestionOption.find({
      where: { IsActive: true, isDeleted: false, questionId: req.params.id },
      raw: true,
    }).exec();

    if (options) {
      let response: ResponseInterface = {
        responseCode: 1,
        responseStatus: "success",
        responseMessage: "List of all Options",
        data: { data: options },
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
  } catch (error) {
    console.log(error);
  }
}

export async function deleteOneQuestionOptionUtil(id: string) {
  if (id) {
    let optionCheck = await Dependencies.find({
      'dependsOnOptions.id': id,
      isDeleted:false
    });
    if (optionCheck.length > 0) {
      let response: ResponseInterface = {
        responseCode: 0,
        responseStatus: "error",
        responseMessage:
          "This option can not be deleted as some other question depends on it",
        data: {},
      };
      return response;
    } else {
      console.log('got here ')
      let optionCheck = await QuestionOption.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(id) },
        { isDeleted: true },
        { new: true }
      );
      console.log(optionCheck , " deleted option")
      if (optionCheck) {
        // for (let i = 0; i < optionCheck.image.length; i++) {
        //     fs.unlink(optionCheck.image[i], function (err) {
        //         if (err) {
        //             let response: ResponseInterface = {
        //                 responseCode: 1,
        //                 responseStatus: "error",
        //                 responseMessage: "Error occurred",
        //                 data: { data: null },
        //             };
        //             return response;
        //         };
        //     });
        // }
        let response: ResponseInterface = {
          responseCode: 1,
          responseStatus: "success",
          responseMessage: "Option deleted successfully",
          data: {},
        };
        return response;
      } else {
        let response: ResponseInterface = {
          responseCode: 1,
          responseStatus: "error",
          responseMessage: "error while deleting option",
          data: {},
        };
        return response;
      }
    }
  }
}

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
import {
  Dependencies,
  DependenciesInterface,
} from "../models/dependenciesModel";
import mongoose from "mongoose";
import { BasePrice } from "../models/basePriceModel";

export async function addQuestionUtil(model: QuestionInterface) {
  if (model) {
    if(model.isBasic){
      const basicQuestionCount: number = await Question.countDocuments({isBasic:true , isDeleted:false})
      model.displayOrder = basicQuestionCount+1
    }
    else if(!model.isBasic){
      const detailedQuestionCount: number = await Question.countDocuments({isBasic:false , isDeleted:false})
      model.displayOrder = 200+detailedQuestionCount+1
    }
    const newModel = new Question(model);
    let res = await newModel.save();
    if (res) {
      let response: ResponseInterface = {
        responseCode: 1,
        responseStatus: "success",
        responseMessage: "Cost Estimator saved successfully",
        data: { data: res },
      };
      return response;
    } else {
      let response: ResponseInterface = {
        responseCode: 0,
        responseStatus: "error",
        responseMessage: "Failed to save Cost Estimator model",
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

export async function addQuestionOptionUtil(model: QuestionOptionInterface) {
  if (model) {
    const newModel = new QuestionOption(model);
    console.log("model", model);
    let res = await newModel.save();
    if (res) {
      let response: ResponseInterface = {
        responseCode: 1,
        responseStatus: "success",
        responseMessage: "Cost Estimator option saved successfully",
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

export async function readAllQuestionUtil() {
  try {
    let questions: QuestionInterface[] = await Question.find({
      isDeleted: false,
    }).sort({displayOrder:1});
    if (questions) {
      let response: ResponseInterface = {
        responseCode: 1,
        responseStatus: "success",
        responseMessage: "List of all Cost Estimator",
        data: { data: questions },
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

export async function readAllBasicQuestionUtil() {
  try {
    let questions: QuestionInterface[] = await Question.find({
      IsActive: true,
      isDeleted: false,
      isBasic:true
    });

    if (questions) {
      let response: ResponseInterface = {
        responseCode: 1,
        responseStatus: "success",
        responseMessage: "List of all basic questions",
        data: { data: questions },
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

export async function readAllDetailedQuestionUtil() {
  try {
    let questions: QuestionInterface[] = await Question.find({
      IsActive: true,
      isDeleted: false,
      isBasic:false
    });

    if (questions) {
      let response: ResponseInterface = {
        responseCode: 1,
        responseStatus: "success",
        responseMessage: "List of all detailed questions",
        data: { data: questions },
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

export async function readQuestionsMobileUtil() {
  try {
    let resArray : object[] = []
    let questions: QuestionInterface[] = await Question.find({
      IsActive: true,
      isDeleted: false,
    },{_id:1,title:1,details:1,isBasic:1 , isDependent:1,displayOrder:1})
    .sort({displayOrder:1})
    for(let i=0 ;i<questions.length ; i++){
     const res = await Promise.all([
       QuestionOption.find({questionId:questions[i]._id , isDeleted: false},{_id:1,title:1,details:1,priceEffectPSF:1,image:1}),
        Dependencies.find({'dependentQuestion.id' : questions[i]._id , isDeleted: false},{'dependsOnQuestion.id':1,'dependsOnOptions.id':1 ,_id:0}) 
      ])
      resArray.push({
        question:questions[i],
        options:res[0],
        dependencies:res[1]
      })
    }

    if (questions) {
      const basePrice = await BasePrice.findOne({isActive:true , isDeleted:false},{basePrice:1,_id:0})  
      
      let response: ResponseInterface = {
        responseCode: 1,
        responseStatus: "success",
        basePrice:basePrice?.basePrice ?? '',
        responseMessage: "List of all Cost Estimator",
        data: resArray,
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

export async function readOneQuestionUtil(id: string) {
  try {
    let questions: QuestionInterface[] = await Question.find({
      _id: id,
      IsActive: true,
    });
    let options: QuestionOptionInterface[] = await QuestionOption.find({
      questionId: id,
      IsActive: true,
      isDeleted: false,
    });
    let dependencies: DependenciesInterface[] = await Dependencies.find({
      "dependentQuestion.id": id,
      isDeleted: false,
    });
    if (questions && options && dependencies) {
      let response: ResponseInterface = {
        responseCode: 1,
        responseStatus: "success",
        responseMessage: "List of all Cost Estimator",
        data: {
          data: {
            questions,
            options,
            dependencies,
          },
        },
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

export async function updateOneQuestionUtil(
  id: string,
  model: QuestionInterface
) {
  if (model) {
    let res = await Question.findOneAndUpdate({ _id: id }, model, {
      new: true,
    });
    if (res) {
      let response: ResponseInterface = {
        responseCode: 1,
        responseStatus: "success",
        responseMessage: "question updated successfully",
        data: { data: res },
      };
      return response;
    } else {
      let response: ResponseInterface = {
        responseCode: 0,
        responseStatus: "error",
        responseMessage: "Failed to update model",
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


export async function updateQuestionDisplayOrderUtil(displayOrders: any) {
  if (displayOrders) {
    let questionOrders = displayOrders
    let res = await Question.findOneAndUpdate({ _id: questionOrders.id1,isDeleted:false }, {displayOrder: questionOrders.displayOrder2}, {
      new: true,
    });
    let res2 = await Question.findOneAndUpdate({ _id: questionOrders.id2 ,isDeleted:false}, {displayOrder: questionOrders.displayOrder1}, {
      new: true,
    });
    if (res && res2) {
      let response: ResponseInterface = {
        responseCode: 1,
        responseStatus: "success",
        responseMessage: "display order updated successfully",
        data: { data: res },
      };
      return response;
    } else {
      let response: ResponseInterface = {
        responseCode: 0,
        responseStatus: "error",
        responseMessage: "Failed to update display order",
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



export async function deleteOneQuestionUtil(id: string) {
  if (id) {
    let res = await Dependencies.find({
      "dependsOnQuestion.id": new mongoose.Types.ObjectId(id),isDeleted:false
    });
    if (res.length > 0) {
      let response: ResponseInterface = {
        responseCode: 0,
        responseStatus: "error",
        responseMessage:
          "Question cant be deleted because some other question depends on it",
        data: { data: [] },
      };
      return response;
    } else {
      let dependRes = await Dependencies.updateMany(
        { "dependentQuestion.id": new mongoose.Types.ObjectId(id) },
        { isDeleted: true }
      );
      console.log("dependRes", dependRes);
      // if (dependRes) {
      let optionRes = await QuestionOption.updateMany(
        { questionId: new mongoose.Types.ObjectId(id) },
        { isDeleted: true },
      );
      console.log("optionRes", optionRes);
      if (optionRes.acknowledged) {
        let res = await Question.findOneAndUpdate(
          { _id: new mongoose.Types.ObjectId(id) },
          { isDeleted: true },
          { new: true }
        );
        console.log(res , "deleted question response")
        let allQuestions = []
        if(res.isBasic){
          allQuestions = await Question.find({isDeleted:false, isBasic:true, displayOrder : {$gt : res.displayOrder}},{displayOrder:1})
        }
        else{
          allQuestions = await Question.find({isDeleted:false, isBasic:false, displayOrder : {$gt : res.displayOrder}},{displayOrder:1})
        }
        if(allQuestions.length>0){
          for(let i =0 ; i< allQuestions.length ; i++){
            let updateOneByOne = await Question.findOneAndUpdate({_id : allQuestions[i]._id},{displayOrder:allQuestions[i].displayOrder - 1})
          }
        }
        if (res) {
          let response: ResponseInterface = {
            responseCode: 1,
            responseStatus: "success",
            responseMessage: "Question deleted successfully",
            data: {},
          };
          return response;
        } else {
          let response: ResponseInterface = {
            responseCode: 0,
            responseStatus: "error",
            responseMessage: "Failed to delete question",
            data: {},
          };
          return response;
        }
      }
      // }
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


export async function readAllQuestionDisplayOrdersUtil() {
  try {
    let questions: QuestionInterface[] = await Question.find({
      IsActive: true,
      isDeleted: false,
    },{_id:0 , displayOrder:1});
    let resArray : string[]= []
    if(questions.length>0){
      for(let i=0; i<questions.length ; i++){
         resArray.push(questions[i].displayOrder.toString())
      }
    }
    if (questions) {
      let response: ResponseInterface = {
        responseCode: 1,
        responseStatus: "success",
        responseMessage: "List of all question display orders",
        data: resArray ,
      };
      return response;
    } else {
      let response: ResponseInterface = {
        responseCode: 0,
        responseStatus: "error",
        responseMessage: "Error occurred",
        data: null,
      };
      return response;
    }
  } catch (error) {
    console.log(error);
  }
}

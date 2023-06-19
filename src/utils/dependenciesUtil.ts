import mongoose, { ObjectId } from "mongoose";
import { ResponseInterface } from "../models/responseModel";
import {
  DependenciesInterface,
  Dependencies,
} from "../models/dependenciesModel";
import { Question } from "../models/questionModel";
export async function addDependenciesUtil(model: DependenciesInterface[]) {
  if (model) {
    let res = await Dependencies.insertMany(model);
    if (res) {
      let response: ResponseInterface = {
        responseCode: 1,
        responseStatus: "success",
        responseMessage: "Dependencies added successfully",
        data: { data: res },
      };
      return response;
    } else {
      let response: ResponseInterface = {
        responseCode: 0,
        responseStatus: "error",
        responseMessage: "Failed to save Dependencies model",
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
export async function getDependenciesUtil() {
  let res = await Dependencies.find({ isDeleted: false });
  if (res) {
    let response: ResponseInterface = {
      responseCode: 1,
      responseStatus: "success",
      responseMessage: "List of all Dependencies",
      data: { data: res },
    };
    return response;
  } else {
    let response: ResponseInterface = {
      responseCode: 1,
      responseStatus: "error",
      responseMessage: "Error occurred",
      data: null,
    };
    return response;
  }
}



export async function updateDependencyUtil(dependencies: any) {
  //   console.log("res", dependencies);
  if (dependencies) {
    let res = {};
    for (let i = 0; i < dependencies.length; i++) {
      res = await Dependencies.findOneAndUpdate(
        {
          _id: new mongoose.Types.ObjectId(dependencies[i]?._id),
        },
        dependencies[i],
        { upsert: true, new: true }
      );
    }
    if (res) {
      let response: ResponseInterface = {
        responseCode: 1,
        responseStatus: "success",
        responseMessage: "Dependency updated successfully",
        data: { data: res },
      };
      return response;
    } else {
      let response: ResponseInterface = {
        responseCode: 0,
        responseStatus: "error",
        responseMessage: "Failed to update Dependency model",
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

export async function deleteDependencyUtil(id: string) {
  if (id) {
    let res = await Dependencies.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id) },
      { isDeleted: true },
      { new: true }
    );
    console.log(res , " deleting dependency")
    if (res) {
      let res2 = await Question.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(res.dependentQuestion.id) },
        { isDependent: false },
        { new: true }
      );
      if(res2){
        let response: ResponseInterface = {
          responseCode: 1,
          responseStatus: "success",
          responseMessage: "Dependency deleted successfully",
          data: { data: res },
        };
        return response;
      }
      else{
        let response: ResponseInterface = {
          responseCode: 0,
          responseStatus: "error",
          responseMessage: "Failed to delete Dependency model",
          data: {},
        };
        return response;
      }
    
    } else {
      let response: ResponseInterface = {
        responseCode: 0,
        responseStatus: "error",
        responseMessage: "Failed to delete Dependency model",
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

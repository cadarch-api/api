
import { Construction,ConstructionInterface } from "../models/constructionModel";
import { Architecture ,ArchitectureInterface} from "../models/architectureModel";
import { Renovation,RenovationInterface } from "../models/renovationModel";
import { MobileUser,MobileCredentialsInterface } from "../models/modileUserModel";
import { graphFormatter } from "../config/graphFormatter";
import { ResponseInterface } from "../models/responseModel";

export async function getAllDashboardDataUtil() {
    console.log('got in user util')
    let users : number = await MobileUser.countDocuments({})
    let renovationOrders : object[] = await Renovation.aggregate([
      {
        $facet: {
          "renovationActive": [
            { $match: { isFollowUp: true } },
            { $count: "renovationActive" },
          ],
          "renovationHistory": [
            { $match: { isFollowUp: false } },
            { $count: "renovationHistory" }
          ],
        }
      },
      {
        $project: {
          "renovationActive": { "$arrayElemAt": ["$renovationActive.renovationActive", 0] },
          "renovationHistory": { "$arrayElemAt": ["$renovationHistory.renovationHistory", 0] },
        }
      }
    ])
  
    let constructionOrders : object[] = await Construction.aggregate([
      {
        $facet: {
          "constructionActive": [
            { $match: { isFollowUp: true } },
            { $count: "constructionActive" },
          ],
          "constructionHistory": [
            { $match: { isFollowUp: false } },
            { $count: "constructionHistory" }
          ],
        }
      },
      {
        $project: {
          "constructionActive": { "$arrayElemAt": ["$constructionActive.constructionActive", 0] },
          "constructionHistory": { "$arrayElemAt": ["$constructionHistory.constructionHistory", 0] },
        }
      }
    ])
  
    let architectureOrders : object[] = await Architecture.aggregate([
      {
        $facet: {
          "architectureActive": [
            { $match: { isFollowUp: true } },
            { $count: "architectureActive" },
          ],
          "architectureHistory": [
            { $match: { isFollowUp: false } },
            { $count: "architectureHistory" }
          ],
        }
      },
      {
        $project: {
          "architectureActive": { "$arrayElemAt": ["$architectureActive.architectureActive", 0] },
          "architectureHistory": { "$arrayElemAt": ["$architectureHistory.architectureHistory", 0] },
        }
      }
    ])
    if (renovationOrders && constructionOrders && architectureOrders) {
      let response: ResponseInterface = {
        responseCode: 1,
        responseStatus: "success",
        responseMessage: "",
        data: {
          users: [{
            "users": users
          }],
          renovationOrders,
          constructionOrders,
          architectureOrders
        },
      };
      return response;
    } else {
      let response: ResponseInterface = {
        responseCode: 1,
        responseStatus: "success",
        responseMessage: "",
        data: {},
      };
      return response;
    }
  }
  
  export async function getAllUsersByMonth() {
    let users : object[] = await MobileUser.find({}, { _id: 0, createdAt: 1 });
    let renovations : object[]= await Renovation.find({}, { _id: 0, createdAt: 1 });
    let architecture : object[]= await Architecture.find({}, { _id: 0, createdAt: 1 });
    let construction : object[]= await Construction.find({}, { _id: 0, createdAt: 1 });
  
    if (users && renovations && architecture && construction) {
      let formatedUsers : object[] = await graphFormatter('Users', users)
      let formatedRenovations : object[]= await graphFormatter('Renovation', renovations)
      let formatedArchitecture : object[]= await graphFormatter('Architecture', architecture)
      let formatedConstruction : object[]= await graphFormatter('Construction', construction)
      if (formatedUsers && formatedRenovations && formatedArchitecture && formatedConstruction) {
        let combinedGraphData = [...formatedUsers, ...formatedRenovations, ...formatedArchitecture, ...formatedConstruction]
        let response: ResponseInterface = {
          responseCode: 1,
          responseStatus: "success",
          responseMessage: "",
          data: {
            graphData: combinedGraphData,
          }
        };
        return response;
      }
    }
    else {
      let response: ResponseInterface = {
        responseCode: 0,
        responseStatus: "failure",
        responseMessage: "",
        data: [],
      };
      return response;
    }
  }
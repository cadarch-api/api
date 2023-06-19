import fs from "fs";
import { Attachment } from "../models/attachmentModel";
import { ResponseInterface } from "../models/responseModel";
import {
  ConstructionInterface,
  Construction,
} from "../models/constructionModel";
import mongoose from "mongoose";

import { base64Uplaod } from "../config/multerHelper";
import { sendNotificationSingleDevice } from "../config/notification";
import { MobileUser } from "../models/modileUserModel";
export async function addConstructionUtil(
  req: any,
  res: any,
  model: ConstructionInterface
) {
  if (model) {
    let path: string[] = [];
    //upload image
    if (req.body.attachments.length > 0) {
      for (let i = 0; i < req.body.attachments.length; i++) {
        let uploadImage = await base64Uplaod(
          req.body.attachments[i].uri,
          "construction",
          "images"
        );
        console.log(uploadImage, " :gotten this path");
        if (uploadImage) {
          path.push(uploadImage);
        }
      }
    }
    let audioPath: string = "";
    //upload audio
    if (req.body?.audioFile?.uri) {
      let uploadAudio = await base64Uplaod(
        req.body.audioFile.uri,
        "construction",
        "audio"
      );
      console.log(uploadAudio, " after uploadingg audio");
      if (uploadAudio) {
        audioPath = uploadAudio;
      }
    }
    //get ids of attchments
    console.log(path, ":paths");
    let attachmentsIds: string[] = [];
    if (path.length > 0) {
      for (let j = 0; j < path.length; j++) {
        let newAttachment = new Attachment({
          userId: new mongoose.Types.ObjectId(req.body.userId),
          path: path[j],
          type: "construction",
        });
        let updatedAttachment = await newAttachment.save();
        if (updatedAttachment) {
          attachmentsIds.push(updatedAttachment._id);
        } else {
          fs.unlinkSync(path[j])
        }
      }
    }
    //save audio attchment
    if (audioPath !== null && audioPath !== undefined && audioPath !== "") {
      let newAttachment = new Attachment({
        userId: new mongoose.Types.ObjectId(req.body.userId),
        path: audioPath,
        type: "construction",
      });
      let updatedAttachment = await newAttachment.save();
      if (updatedAttachment) {
        model.audioFile = audioPath;
        attachmentsIds.push(updatedAttachment._id);
      } else {
        fs.unlinkSync(audioPath);
      }
    }
    //save model if images and audio files are uploaded
    if (
      attachmentsIds.length > 0
    ) {
      model.attachmentsPath = attachmentsIds;
      const newModel = new Construction(model);
      console.log("newModel", newModel);
      let res = await newModel.save();
      if (res) {
        let response: ResponseInterface = {
          responseCode: 1,
          responseStatus: "success",
          responseMessage: "Construction saved successfully",
          data: { data: res },
        };
        return response;
      } else {
        if (audioPath && audioPath !== '') {
          fs.unlinkSync(audioPath)
        }
        for (let k = 0; k < path.length; k++) {
          fs.unlinkSync(path[k]);
        }
        let response: ResponseInterface = {
          responseCode: 0,
          responseStatus: "error",
          responseMessage: "Failed to save construction model",
          data: {},
        };
        return response;
      }
    } else {
      let response: ResponseInterface = {
        responseCode: 0,
        responseStatus: "error",
        responseMessage: "Failed to save construction model",
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

// export async function addConstructionUtil(req: any, res: any, model: ConstructionInterface) {
//     if (model) {
//         let attachmentsIds: Object[] = [];
//         if (req && req.files && req.files.length != 0) {
//             for (let i = 0; i < req.files.length; i++) {
//                 let extArray = req.files[0].mimetype.split("/");
//                 if (extArray[0] == "audio") {
//                     model.audioFile = req.files[i].path;
//                 }
//                 const newAttachment = new Attachment({ id: 0, userId: req.body.userId, path: req.files[i].path, type: "construction" });
//                 const updatedAttachment = await newAttachment.save();
//                 if (!updatedAttachment) {
//                     fs.unlinkSync(req.files[i].path);
//                 }
//                 attachmentsIds.push(updatedAttachment._id);
//             }
//         }
//         model.attachmentsPath = attachmentsIds;
//         const newModel = new Construction(model);
//         const res = newModel.save();
//         if (res) {
//             let response: ResponseInterface = {
//                 responseCode: 1,
//                 responseStatus: "success",
//                 responseMessage: "Construction saved successfully",
//                 data: { data: res },
//             };
//             return response;
//         }
//         else {
//             let response: ResponseInterface = {
//                 responseCode: 0,
//                 responseStatus: "error",
//                 responseMessage: "Failed to save construction model",
//                 data: {},
//             };
//             return response;
//         }

//     }
//     else {
//         return {
//             responseCode: 0,
//             responseStatus: "error",
//             responseMessage: "Model doesn't exist",
//             data: {},
//         };
//     }
// }

export async function readAllConstructionUtil() {
  let res = await Construction.find().populate("attachmentsPath", "path type");
  if (res) {
    let response: ResponseInterface = {
      responseCode: 1,
      responseStatus: "success",
      responseMessage: "List of all construction",
      data: { data: res },
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
}

export async function getOneConstructionUtil(id: Object) {
  let res = Construction.findById({ _id: id });
  if (res) {
    let response: ResponseInterface = {
      responseCode: 1,
      responseStatus: "success",
      responseMessage: "Architecture",
      data: { data: res },
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
}

export async function deleteOneConstructionUtil(id: string) {
  let res = await Construction.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, { isDeleted: true }, { new: true });
  if (res) {
    let response: ResponseInterface = {
      responseCode: 1,
      responseStatus: "success",
      responseMessage: "Construction successfully deleted",
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

export async function updateOneConstructionUtil(req: any, res: any, id: string) {

  let resp = await Construction.findOneAndUpdate({ _id: id }, req.body, { new: true });
  if (resp) {
    let response: ResponseInterface = {
      responseCode: 1,
      responseStatus: "success",
      responseMessage: "construction updated successfully",
      data: { data: resp },
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

export async function readAllPaginatedConstructionUtil(req: any) {
  if (req.query.userId && req.query.page && req.query.limit) {
    const userId = new mongoose.Types.ObjectId(req.query.userId)
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const skip = (page - 1) * limit
    let res = await Construction.find({ userId: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate({
        path: 'attachmentsPath',
        select: { _id: 0, updatedAt: 0, createdAt: 0 },
      })

    console.log(res, ":paginated")
    if (res) {
      let response: ResponseInterface = {
        responseCode: 1,
        responseStatus: "success",
        responseMessage: "List of paginated sorted construction orders",
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

export async function readAllPaginatedConstructionHistoryUtil(req: any) {
  const userId = new mongoose.Types.ObjectId(req.query.userId)
  const page = parseInt(req.query.page)
  const limit = parseInt(req.query.limit)
  const skip = (page - 1) * limit
  let res = await Construction.find({ userId: userId, isFollowUp: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .populate({
      path: 'attachmentsPath',
      select: { _id: 0, updatedAt: 0, createdAt: 0 },
    })

  console.log(res, ":paginated")
  if (res) {
    let response: ResponseInterface = {
      responseCode: 1,
      responseStatus: "success",
      responseMessage: "List of paginated sorted construction orders history",
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

export async function sendConstructionOrderNotificationUtil(
  req: any,
  res: any,
) {
  try {
    let orderId = req.body.orderId;
    let userId = req.body.userId;
    const promises = await Promise.all([
      Construction.findOne({ isNotified: false, _id: orderId }),
      MobileUser.findOne({ _id: userId, fcmToken: { $ne: "#" } }, { _id: 0, fcmToken: 1 })
    ])
    const achitecture = promises[0]
    const user = promises[1]
    if (user && achitecture) {
      let token = user.fcmToken;
      await sendNotificationSingleDevice(token, "construction", "Order Response", "Cadarch Team has responded your Order Query");
      await Construction.findOneAndUpdate({ _id: orderId }, { isNotified: true })
    }
  }
  catch (e) {
    console.log(e, "exception occurred")
  }
}

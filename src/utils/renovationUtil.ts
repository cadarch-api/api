import fs from "fs";
import { Attachment } from "../models/attachmentModel";
import { ResponseInterface } from "../models/responseModel";
import { RenovationInterface, Renovation } from "../models/renovationModel";
import mongoose from "mongoose";
import { base64Uplaod } from '../config/multerHelper';
import { MobileUser } from "../models/modileUserModel";
import { sendNotificationSingleDevice } from "../config/notification";


export async function addRenovationUtil(req: any, res: any, model: RenovationInterface) {
  if (model) {
    let path: string[] = []
    //upload image
    if (req.body.attachments.length > 0) {
      for (let i = 0; i < req.body.attachments.length; i++) {
        let uploadImage = await base64Uplaod(req.body.attachments[i].uri, "renovation", 'images')
        console.log(uploadImage, " :gotten this path")
        if (uploadImage) {
          path.push(uploadImage)
        }
      }
    }
    let audioPath: string = ''
    //upload audio
    if (req.body?.audioFile?.uri) {
      let uploadAudio = await base64Uplaod(req.body.audioFile.uri, "renovation", 'audio')
      console.log(uploadAudio, " after uploadingg audio")
      if (uploadAudio) {
        audioPath = uploadAudio
      }
    }
    //get ids of attchments
    console.log(path, ":paths")
    let attachmentsIds: string[] = []
    if (path.length > 0) {
      for (let j = 0; j < path.length; j++) {
        let newAttachment = new Attachment({
          userId: new mongoose.Types.ObjectId(req.body.userId),
          path: path[j],
          type: "renovation"
        });
        let updatedAttachment = await newAttachment.save();
        if (updatedAttachment) {
          attachmentsIds.push(updatedAttachment._id)
        }
        else {
          fs.unlinkSync(path[j])
        }
      }
    }
    //save audio attchment
    if (audioPath !== null && audioPath !== undefined && audioPath !== '') {
      let newAttachment = new Attachment({
        userId: new mongoose.Types.ObjectId(req.body.userId),
        path: audioPath,
        type: "renovation"
      });
      let updatedAttachment = await newAttachment.save();
      if (updatedAttachment) {
        model.audioFile = audioPath
        attachmentsIds.push(updatedAttachment._id)
      }
      else {
        fs.unlinkSync(audioPath)
      }
    }
    //save model if images and audio files are uploaded
    if (attachmentsIds.length > 0) {
      model.attachmentsPath = attachmentsIds;
      const newModel = new Renovation(model);
      console.log('newModel', newModel)
      let res = await newModel.save();
      if (res) {
        let response: ResponseInterface = {
          responseCode: 1,
          responseStatus: "success",
          responseMessage: "Renovation saved successfully",
          data: { data: res },
        };
        return response;
      }
      else {
        if (audioPath && audioPath !== '') {
          fs.unlinkSync(audioPath)
        }

        for (let k = 0; k < path.length; k++) {
          fs.unlinkSync(path[k])
        }
        let response: ResponseInterface = {
          responseCode: 0,
          responseStatus: "error",
          responseMessage: "Failed to save renovation model",
          data: {},
        };
        return response;
      }
    }
    else {
      let response: ResponseInterface = {
        responseCode: 0,
        responseStatus: "error",
        responseMessage: "Failed to save renovation model",
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

// export async function addRenovationUtil(
//   req: any,
//   res: any,
//   model: RenovationInterface
// ) {
//   if (model) {
//     let attachmentsIds: Object[] = [];
//     model.audioFile = "";
//     if (req && req.files && req.files.length != 0) {
//       console.log("images");

//       for (let i = 0; i < req.files.length; i++) {
//         console.log("image", req.files[i]);
//         let extArray = req.files[0].mimetype.split("/");
//         if (extArray[0] == "audio") {
//           console.log(req.files[i].path);
//           model.audioFile = req.files[i].path;
//         }
//         const newAttachment = new Attachment({
//           id: 0,
//           userId: req.body.userId,
//           path: req.files[i].path,
//           type: "renovation",
//         });
//         const updatedAttachment = await newAttachment.save();
//         if (!updatedAttachment) {
//           fs.unlinkSync(req.files[i].path);
//         }
//         attachmentsIds.push(updatedAttachment._id);
//       }
//     }
//     model.attachmentsPath = attachmentsIds;
//     const newModel = new Renovation(model);
//     let res = await newModel.save();
//     if (res) {
//       let response: ResponseInterface = {
//         responseCode: 1,
//         responseStatus: "success",
//         responseMessage: "Renovation saved successfully",
//         data: { data: res },
//       };
//       return response;
//     } else {
//       let response: ResponseInterface = {
//         responseCode: 0,
//         responseStatus: "error",
//         responseMessage: "Failed to save renovation model",
//         data: {},
//       };
//       return response;
//     }
//   } else {
//     return {
//       responseCode: 0,
//       responseStatus: "error",
//       responseMessage: "Model doesn't exist",
//       data: {},
//     };
//   }
// }

export async function readAllRenovationUtil() {
  let res = await Renovation.find().populate("attachmentsPath", "path type");
  if (res) {
    let response: ResponseInterface = {
      responseCode: 1,
      responseStatus: "success",
      responseMessage: "List of all renovations",
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

export async function readAllPaginatedRenovationsUtil(req: any) {
  if (req.query.userId && req.query.page && req.query.limit) {
    const userId = new mongoose.Types.ObjectId(req.query.userId);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    let res = await Renovation.find({ userId: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate({
        path: "attachmentsPath",
        select: { _id: 0, updatedAt: 0, createdAt: 0 },
      });

    console.log(res, ":paginated");
    if (res) {
      let response: ResponseInterface = {
        responseCode: 1,
        responseStatus: "success",
        responseMessage: "List of paginated sorted renovations orders",
        data: { data: res },
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

export async function readAllPaginatedRenovationsHistoryUtil(req: any) {
  const userId = new mongoose.Types.ObjectId(req.query.userId);
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const skip = (page - 1) * limit;
  let res = await Renovation.find({ userId: userId, isFollowUp: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .populate({
      path: "attachmentsPath",
      select: { _id: 0, updatedAt: 0, createdAt: 0 },
    });
  if (res) {
    let response: ResponseInterface = {
      responseCode: 1,
      responseStatus: "success",
      responseMessage: "List of paginated sorted renovations orders history",
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

export async function deleteOneRenovationUtil(id: string) {
  let res = Renovation.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, { isDeleted: true }, { new: true });
  if (res) {
    let response: ResponseInterface = {
      responseCode: 1,
      responseStatus: "success",
      responseMessage: "Renovation successfully deleted",
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

export async function updateOneRenovationUtil(req: any, res: any, id: string) {
  let resp = await Renovation.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  if (resp) {
    let response: ResponseInterface = {
      responseCode: 1,
      responseStatus: "success",
      responseMessage: "Renovation updated successfully",
      data: { data: resp },
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

export async function sendRenovationOrderNotificationUtil(
  req: any,
  res: any,
) {
  try {
    let orderId = req.body.orderId;
    let userId = req.body.userId;
    const promises = await Promise.all([
      Renovation.findOne({ isNotified: false, _id: orderId }),
      MobileUser.findOne({ _id: userId, fcmToken: { $ne: "#" } }, { _id: 0, fcmToken: 1 })
    ])
    const achitecture = promises[0]
    const user = promises[1]
    if (user && achitecture) {
      let token = user.fcmToken;
      await sendNotificationSingleDevice(token, "renovation", "Order Response", "Cadarch Team has responded your Order Query");
      await Renovation.findOneAndUpdate({ _id: orderId }, { isNotified: true })
    }
  }
  catch (e) {
    console.log(e, "exception occurred")
  }
}


import fs from 'fs';
import { Attachment } from '../models/attachmentModel';
import { ResponseInterface } from '../models/responseModel';
import { ArchitectureInterface, Architecture } from '../models/architectureModel';
import mongoose from 'mongoose';
import { base64Uplaod } from '../config/multerHelper';
import { MobileUser } from '../models/modileUserModel';
import { sendNotificationSingleDevice } from '../config/notification';
export async function addArchitectureUtil(req: any, res: any, model: ArchitectureInterface) {
  if (model) {
    let path: string[] = []
    //upload image
    if (req.body.attachments.length > 0) {
      for (let i = 0; i < req.body.attachments.length; i++) {
        let uploadImage = await base64Uplaod(req.body.attachments[i].uri, "architecture", 'images')
        console.log(uploadImage, " :gotten this path")
        if (uploadImage) {
          path.push(uploadImage)
        }
      }
    }
    let audioPath: string = ''
    //upload audio
    if (req.body?.audioFile?.uri) {
      let uploadAudio = await base64Uplaod(req.body.audioFile.uri, "architecture", 'audio')
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
          type: "achitecture"
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
        type: "achitecture"
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
      const newModel = new Architecture(model);
      console.log('newModel', newModel)
      let res = await newModel.save();
      if (res) {
        let response: ResponseInterface = {
          responseCode: 1,
          responseStatus: "success",
          responseMessage: "Architecture saved successfully",
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
          responseMessage: "Failed to save architecture model",
          data: {},
        };
        return response;
      }
    }
    else {
      let response: ResponseInterface = {
        responseCode: 0,
        responseStatus: "error",
        responseMessage: "Failed to save architecture model",
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

export async function readAllArchitectureUtil() {
  let res = await Architecture.find().populate("attachmentsPath", "path type");
  if (res) {
    let response: ResponseInterface = {
      responseCode: 1,
      responseStatus: "success",
      responseMessage: "List of all architecture",
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

export async function getOneArchitectureUtil(id: Number) {
  let res = Architecture.findById({ _id: id });
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

export async function deleteOneArchitectureUtil(id: string) {
  let res = await Architecture.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(id) },
    { isDeleted: true },
    { new: true }
  );
  if (res) {
    let response: ResponseInterface = {
      responseCode: 1,
      responseStatus: "success",
      responseMessage: "Architecture successfully deleted",
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

export async function updateOneArchitectureUtil(
  req: any,
  res: any,
  id: string
) {
  let resp = await Architecture.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  if (resp) {
    let response: ResponseInterface = {
      responseCode: 1,
      responseStatus: "success",
      responseMessage: "architecture updated successfully",
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

export async function sendArchitectureOrderNotificationUtil(
  req: any,
  res: any,
) {
  try {
    let orderId = req.body.orderId;
    let userId = req.body.userId;
    const promises = await Promise.all([
      Architecture.findOne({ isNotified: false, _id: orderId }),
      MobileUser.findOne({ _id: userId, fcmToken: { $ne: "#" } }, { _id: 0, fcmToken: 1 })
    ])
    const achitecture = promises[0]
    const user = promises[1]
    if (user && achitecture) {
      let token = user.fcmToken;
      await sendNotificationSingleDevice(token, "architecture", "Order Response", "Cadarch Team has responded your Order Query");
      await Architecture.findOneAndUpdate({ _id: orderId }, { isNotified: true })
    }
  }
  catch (e) {
    console.log(e, "exception occurred")
  }
}



export async function readAllPaginatedArchitectureUtil(req: any) {
  if (req.query.userId && req.query.page && req.query.limit) {
    const userId = new mongoose.Types.ObjectId(req.query.userId)
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const skip = (page - 1) * limit
    let res = await Architecture.find({ userId: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate({
        path: 'attachmentsPath',
        select: { _id: 0, updatedAt: 0, createdAt: 0 },
      })
    if (res) {
      let response: ResponseInterface = {
        responseCode: 1,
        responseStatus: "success",
        responseMessage: "List of paginated sorted architecture orders",
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

export async function readAllPaginatedArchitectureHistoryUtil(req: any) {
  const userId = new mongoose.Types.ObjectId(req.query.userId);
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const skip = (page - 1) * limit;
  let res = await Architecture.find({ userId: userId, isFollowUp: true })
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
      responseMessage: "List of paginated sorted architecture orders history",
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

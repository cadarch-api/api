import fs from "fs";
import { Attachment } from "../models/attachmentModel";
import { ResponseInterface } from "../models/responseModel";
import mongoose from "mongoose";
import { NewsInterface, News } from "../models/newsModel";
export async function addNewsUtil(req: any, res: any, model: NewsInterface) {
  if (model) {
    let attachmentsIds: Object[] = [];
    console.log("addnews", req.files);
    if (req?.files?.length != 0) {
      for (let i = 0; i < req.files.length; i++) {
        const newAttachment = new Attachment({
          userId: req.body.userId,
          path: req.files[i].path,
          type: "news",
        });
        const updatedAttachment = await newAttachment.save();
        if (!updatedAttachment) {
          fs.unlinkSync(req.files[i].path);
        }
        attachmentsIds.push(updatedAttachment._id);
      }
    }
    model.attachmentsPath = attachmentsIds;
    const newModel = new News(model);
    console.log("newModel", newModel);
    let res = await newModel.save();
    if (res) {
      let response: ResponseInterface = {
        responseCode: 1,
        responseStatus: "success",
        responseMessage: "News saved successfully",
        data: { data: res },
      };
      return response;
    } else {
      let response: ResponseInterface = {
        responseCode: 0,
        responseStatus: "error",
        responseMessage: "Failed to save news model",
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

export async function updateNewsUtil(req: any, res: any, model: NewsInterface) {
  if (model) {
    let attachmentsIds: Object[] = [];
    if (req?.files?.length != 0) {
      const oldAttachments = await News.findOne(
        { _id: req.query.id },
        { _id: 0, attachmentsPath: 1 }
      ).populate({
        path: "attachmentsPath",
        select: { _id: 0, path: 1 },
      });
      console.log(oldAttachments, " :old attachments");
      if (oldAttachments) {
        for (let j = 0; j < oldAttachments.attachmentsPath.length; j++) {
          fs.unlink(oldAttachments.attachmentsPath[j].path, function (err) {
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
      const deleteOldAttachments = await News.findOne(
        { _id: req.query.id },
        { _id: 0, attachmentsPath: 1 }
      );
      if (deleteOldAttachments) {
        let deletedAttachments = await Attachment.deleteMany({
          _id: { $in: deleteOldAttachments.attachmentsPath },
        });
        if (deletedAttachments?.acknowledged === false) {
          let response: ResponseInterface = {
            responseCode: 1,
            responseStatus: "error",
            responseMessage: "Error occurred",
            data: { data: null },
          };
          return response;
        }
      }
      for (let i = 0; i < req.files.length; i++) {
        const newAttachment = new Attachment({
          userId: req.body.userId,
          path: req.files[i].path,
          type: "news",
        });
        const updatedAttachment = await newAttachment.save();
        if (!updatedAttachment) {
          fs.unlinkSync(req.files[i].path);
        }
        attachmentsIds.push(updatedAttachment._id);
      }
      model.attachmentsPath = attachmentsIds;
    }

    let res = await News.findOneAndUpdate({ _id: req.query.id }, model);
    if (res) {
      let response: ResponseInterface = {
        responseCode: 1,
        responseStatus: "success",
        responseMessage: "News updated successfully",
        data: { data: res },
      };
      return response;
    } else {
      let response: ResponseInterface = {
        responseCode: 0,
        responseStatus: "error",
        responseMessage: "Failed to update news model",
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

export async function readAllNewsUtil() {
  let res = await News.find({ isDeleted: false }).populate({
    path: "attachmentsPath",
  });
  if (res) {
    let response: ResponseInterface = {
      responseCode: 1,
      responseStatus: "success",
      responseMessage: "List of all news",
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

export async function deleteOneNewsUtil(id: string) {
  if (id) {
    console.log("id", id);
    let res = await News.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id) },
      { isDeleted: true },
      { new: true }
    );
    if (res) {
      //   if (res.attachmentsPath) {
      //     for (let i = 0; i < res.attachmentsPath.length; i++) {
      //       fs.unlink(res.attachmentsPath[i], function (err) {
      //         if (err) {
      //           let response: ResponseInterface = {
      //             responseCode: 1,
      //             responseStatus: "error",
      //             responseMessage: "Error occurred",
      //             data: { data: null },
      //           };
      //           return response;
      //         }
      //       });
      //     }
      //     let deletedAttachments = await Attachment.deleteMany({
      //       _id: { $in: res.attachmentsPath },
      //     });
      //     if (deletedAttachments?.acknowledged === false) {
      //       let response: ResponseInterface = {
      //         responseCode: 1,
      //         responseStatus: "error",
      //         responseMessage: "Error occurred",
      //         data: { data: null },
      //       };
      //       return response;
      //     }
      //   }

      let response: ResponseInterface = {
        responseCode: 1,
        responseStatus: "success",
        responseMessage: "news successfully deleted",
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
  } else {
    let response: ResponseInterface = {
      responseCode: 0,
      responseStatus: "error",
      responseMessage: "Id is required to delete record.",
      data: {},
    };
    return response;
  }
}

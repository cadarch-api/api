import mongoose from "mongoose";
import { ResponseInterface } from "../models/responseModel";
import { Plot, PlotsInterface } from "../models/plotsModel";
import { Attachment } from "../models/attachmentModel";
import fs from "fs";
export async function addPlotUtil(req: any, res: any, model: PlotsInterface) {
  if (model) {
    let attachmentsIds: Object[] = [];
    if (req?.files?.length != 0) {
      for (let i = 0; i < req.files.length; i++) {
        const newAttachment = new Attachment({
          userId: req.body.userId,
          path: req.files[i].path,
          type: "plot",
        });
        const updatedAttachment = await newAttachment.save();
        if (!updatedAttachment) {
          fs.unlinkSync(req.files[i].path);
        }
        attachmentsIds.push(updatedAttachment._id);
      }
    }
    model.attachmentsPath = attachmentsIds;
    const newModel = new Plot(model);
    let res = await newModel.save();
    if (res) {
      let response: ResponseInterface = {
        responseCode: 1,
        responseStatus: "success",
        responseMessage: "Plot saved successfully",
        data: { data: res },
      };
      return response;
    } else {
      let response: ResponseInterface = {
        responseCode: 0,
        responseStatus: "error",
        responseMessage: "Failed to save plot model",
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

export async function readAllPlotsUtil() {
  let res = await Plot.find({ isDeleted: false })
    .sort({ createdAt: -1 })
    .populate({
      path: "attachmentsPath",
      select: { _id: 0, updatedAt: 0, createdAt: 0 },
    });
  if (res) {
    let response: ResponseInterface = {
      responseCode: 1,
      responseStatus: "success",
      responseMessage: "List of all plots",
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

export async function readAllPlotsMobileUtil() {
  let res = await Plot.find({ isDeleted: false }, {
    title: 1,
    coveredArea: 1,
    coveredAreaWithBasement: 1,
  })
    .sort({ createdAt: -1 })
    .populate({
      path: "attachmentsPath",
      select: { _id: 0, path: 1 },
    })
   
  if (res) {
    let newRes = []
    if(res.length>0){
      
      for(let i=0 ; i<res.length ; i++){
        newRes.push(
          {
            _id:res[i]._id,
            title:res[i].title,
            coveredArea:res[i].coveredArea,
            coveredAreaWithBasement:res[i].coveredAreaWithBasement,
            image : res[i].attachmentsPath[0].path
          }
        )
    
      }
    }
   
    let response: ResponseInterface = {
      responseCode: 1,
      responseStatus: "success",
      responseMessage: "List of all plots",
      data: { data: newRes },
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

export async function deleteOnePlotUtil(id: string) {
  // let res = await Plot.findOneAndDelete({ _id: id }, { new: true });
  let res = await Plot.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(id) },
    { isDeleted: true },
    { new: true }
  );
  if (res) {
    let response: ResponseInterface = {
      responseCode: 1,
      responseStatus: "success",
      responseMessage: "Plot deleted successfully",
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

export async function updatePlotUtil(
  req: any,
  res: any,
  model: PlotsInterface
) {
  if (model) {
    console.log("model", model);

    let attachmentsIds: Object[] = [];
    if (req?.files?.length != 0) {
      const oldAttachments = await Plot.findOne(
        { _id: req.query.id },
        { _id: 0, attachmentsPath: 1 }
      ).populate({
        path: "attachmentsPath",
        select: { _id: 0, path: 1 },
      });
      console.log(oldAttachments, " :old attachments");
      if (oldAttachments) {
        for (let j = 0; j < oldAttachments.attachmentsPath.length; j++) {
          fs.unlink(
            `${oldAttachments.attachmentsPath[j].path}`,
            function (err) {
              if (err) {
                let response: ResponseInterface = {
                  responseCode: 1,
                  responseStatus: "error",
                  responseMessage: "Error occurred",
                  data: { data: null },
                };
                return response;
              }
            }
          );
        }
      }
      const deleteOldAttachments = await Plot.findOne(
        { _id: req.query.id },
        { _id: 0, attachmentsPath: 1 }
      );
      if (deleteOldAttachments) {
        let deletedAttachments = await Plot.deleteMany({
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
          type: "plot",
        });
        const updatedAttachment = await newAttachment.save();
        if (!updatedAttachment) {
          fs.unlinkSync(req.files[i].path);
        }
        attachmentsIds.push(updatedAttachment._id);
      }
      model.attachmentsPath = attachmentsIds;
    }

    let res = await Plot.findOneAndUpdate({ _id: req.query.id }, model);
    if (res) {
      let response: ResponseInterface = {
        responseCode: 1,
        responseStatus: "success",
        responseMessage: "Plot updated successfully",
        data: { data: res },
      };
      return response;
    } else {
      let response: ResponseInterface = {
        responseCode: 0,
        responseStatus: "error",
        responseMessage: "Failed to update Plot",
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

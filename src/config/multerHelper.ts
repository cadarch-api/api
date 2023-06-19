import { buffer } from "stream/consumers";

const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mime = require('mime');
export const getStorage = (folderPath: string) => {
  const storage = multer.diskStorage({
    // destination: path.join('./uploads/', folderPath),

    destination: function (req: any, file: any, callback: any) {
      let extArray = file.mimetype.split("/");
      if (extArray[0] == "audio") {
        let folder = path.join("./public/uploads/", folderPath, "audio");
        if (!fs.existsSync(folder)) {
          fs.mkdirSync(folder, { recursive: true });
        }
        callback(null, folder);
      } else if (extArray[0] == "image") {
        let folder = path.join("./public/uploads/", folderPath, "images");
        if (!fs.existsSync(folder)) {
          fs.mkdirSync(folder, { recursive: true });
        }
        callback(null, folder);
      }
    },
    filename: function (req: any, file: any, cb: any) {
      let extArray = file.mimetype.split("/");
      var fileName = file?.originalname?.split(".")?.[0]?.replace(/\s/g, "");
      if (extArray[0] == "audio") {
        cb(null, fileName + Date.now() + ".mp3");
      } else if (extArray[0] == "image") {
        let extension = "." + extArray[extArray.length - 1];
        cb(null, fileName + Date.now() + extension);
      }
    },
    onError: function (err: any, next: any) {
      console.log("error", err);
      next(err);
    },
  });
  return storage;
};

export const getUpload = (folderPath: string) => {
  const upload = multer({ storage: getStorage(folderPath) }).array(
    "attachments"
  );
  return upload;
};

export const base64Uplaod = async (image: any, category: string,fileType:string ) :Promise<any> => {
 return new Promise((resolve)=>{
  var matches = image.match(/^data:([A-Za-z0-9-+/]+);base64,(.+)$/)
  let response: any = {}
  if (matches.length !== 3) {
    console.log('invalid input string')
  }
  response["type"] = matches[1];
  response["data"] = Buffer.from(matches[2], 'base64')
  let decodedImg = response;
  let imageBuffer = decodedImg.data;
  let type = decodedImg.type;
  let extension = type.split('/')[1]
  console.log(type, "---", extension, "---")
  try {
    if (type.startsWith('image') || type.startsWith('audio') ) {
      let rawPath = `./public/uploads/${category}/${fileType}/${Date.now()}.${extension}`
      let formatedPath = rawPath.replace(/\s/g, "")
      fs.writeFile(formatedPath, imageBuffer, (err: boolean) => {
        if (err)
          {console.log(err)
            resolve(null)
          }
        else {
          console.log(formatedPath.slice(9))
          console.log("uploaded successfully")
          resolve(formatedPath.slice(9))
        }
      });
    }
    else {
      console.log('no image file detected')
      resolve(null)
    }
  } catch (e) {
    console.log(e, " :errororr")
  }
 })
}
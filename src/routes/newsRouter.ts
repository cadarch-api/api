import express from "express";
const router = express.Router();
import { checkToken } from "../middlewares/token";
import { getUpload } from "../config/multerHelper";
import {
  addNews,
  deleteOneNews,
  readAllNews,
  updateNews,
} from "../controllers/newsController";
const upload = getUpload("news");
router.post("/addnews", checkToken, async (req: any, res: any) => {
  upload(req, res, async (err: any) => {
    if (err) {
      return res.json({
        responseCode: 0,
        responseStatus: "error",
        responseMessage: "Error occured while uploading files",
        data: {},
      });
    }
    await addNews(req, res);
  });
});
router.patch("/updatenews", checkToken, async (req: any, res: any) => {
  upload(req, res, async (err: any) => {
    if (err) {
      return res.json({
        responseCode: 0,
        responseStatus: "error",
        responseMessage: "Error occured while uploading files",
        data: {},
      });
    }
    await updateNews(req, res);
  });
});
router.get("/loadallnews", checkToken, readAllNews);
router.patch("/deletenewsbyid", checkToken, deleteOneNews);

export default router;

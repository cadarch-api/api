import express from "express";
const router = express.Router();
import { getUpload } from "../config/multerHelper";
import { checkToken } from "../middlewares/token";
import {
  addQuestionOption,
  readAllQuestionOptions,
  readOneQuestionOption,
  deleteOneQuestionOption,
  updateOneQuestionOptions,
} from "../controllers/questionOptionsController";

const upload = getUpload("Question");

router.post("/addquestionoption", checkToken, async (req, res) => {
  upload(req, res, async (err: any) => {
    if (err) {
      res.json({
        responseCode: 0,
        responseStatus: "error",
        responseMessage: "Error occured while uploading files",
        data: {},
      });
    }
    await addQuestionOption(req, res);
  });
});
router.patch("/updateonequestionoption", checkToken, async (req, res) => {
  upload(req, res, async (err: any) => {
    if (err) {
      res.json({
        responseCode: 0,
        responseStatus: "error",
        responseMessage: "Error occured while uploading files",
        data: {},
      });
    }
    await updateOneQuestionOptions(req, res);
  });
});

router.get("/loadallquestionoptions", checkToken, readAllQuestionOptions);

router.get("/getoptionsbyId", checkToken, readOneQuestionOption);

router.patch("/deleteoneoptionbyid", checkToken, deleteOneQuestionOption);

export default router;

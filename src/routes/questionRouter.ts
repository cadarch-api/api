import express from "express";
const router = express.Router();
import { checkToken } from "../middlewares/token";
import {
  addQuestion,
  readAllQuestion,
  readOneQuestion,
  updateOneQuestion,
  deleteOneQuestion,
  readMobileQuestions,
  readAllQuestionsDisplayOrders,
  readAllDetailedQuestion,
  readAllBasicQuestion,
  updateQuestionDisplayOrder,
} from "../controllers/questionController";

router.post("/addquestion", checkToken, addQuestion);
router.get("/loadallquestion", checkToken, readAllQuestion);
router.get("/loadallbasicquestion", checkToken , readAllBasicQuestion);
router.get("/loadalldetailedquestion", checkToken, readAllDetailedQuestion);
router.get("/loadallmobilequestion", checkToken, readMobileQuestions);
router.get("/getquestionbyId", checkToken, readOneQuestion);
router.get("/loadexistingdisplayorders", checkToken, readAllQuestionsDisplayOrders);
router.patch("/updatequestionbyId", checkToken, updateOneQuestion);
router.patch("/updatequestiondisplayorder", checkToken, updateQuestionDisplayOrder);
router.patch("/deletequestionbyId", checkToken, deleteOneQuestion);

export default router;

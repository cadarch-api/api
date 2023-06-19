import express from "express";
const router = express.Router();
import { checkToken } from "../middlewares/token";
import { base64Uplaod, getUpload } from "../config/multerHelper";
import {
  addArchitecture,
  readAllArchitecture,
  getOneArchitecture,
  deleteOneArchitecture,
  updateOneArchitecture,
  readAllPaginatedArchitectureHistory,
  readAllPaginatedArchitecture,
  sendOrderNotification
} from "../controllers/architectureController";

const upload = getUpload("renovation");

router.post("/addarchitecture" , checkToken,addArchitecture)
router.get("/loadallarchitecture", checkToken, readAllArchitecture);
router.patch("/updatearchitecture", checkToken, updateOneArchitecture);
router.post("/sendOrderNotification", checkToken, sendOrderNotification);
router.get(
  "/getallpaginatedarchitecture",
  checkToken,
  readAllPaginatedArchitecture
);
router.get(
  "/getallpaginatedarchitecturehistory",
  checkToken,
  readAllPaginatedArchitectureHistory
);
router.delete("/getarchitectureid", checkToken, getOneArchitecture);
router.delete("/deletearchitecturebyid", checkToken, deleteOneArchitecture);

export default router;

import express from "express";
const router = express.Router();
import { getUpload } from "../config/multerHelper";
import { checkToken } from "../middlewares/token";
import {
  addRenovation,
  readAllRenovation,
  deleteOneRenovation,
  updateOneRenovation,
  readAllPaginatedRenovations,
  readAllPaginatedRenovationsHistory,
  sendOrderNotification,
} from "../controllers/renovationContoller";

const upload = getUpload("renovation");

router.post("/addrenovation",  addRenovation);
router.get('/loadallrenovation', checkToken, readAllRenovation);
router.get('/getonerenovation', checkToken, readAllRenovation);
router.post("/sendOrderNotification", checkToken, sendOrderNotification);
router.get('/getallpaginatedrenovations', checkToken, readAllPaginatedRenovations);
router.get('/getallpaginatedrenovationshistory', checkToken, readAllPaginatedRenovationsHistory);
router.patch('/updaterenovation', checkToken, updateOneRenovation);
router.delete('/deleterenovation', checkToken, deleteOneRenovation);


export default router;

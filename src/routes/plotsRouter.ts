import express from "express";
const router = express.Router();
import { getUpload } from "../config/multerHelper";
const upload = getUpload("plots");
import { checkToken } from "../middlewares/token";
import {
  addPlot,
  readAllPlots,
  deleteOnePlot,
  updatePlot,
  readAllPlotsMobile,
} from "../controllers/plotController";
router.post("/addplot", checkToken, async (req: any, res: any) => {
  upload(req, res, async (err: any) => {
    if (err) {
      return res.json({
        responseCode: 0,
        responseStatus: "error",
        responseMessage: "Error occured while uploading files",
        data: {},
      });
    }
    console.log("addnews", req.files);
    await addPlot(req, res);
  });
});

router.patch("/updateplot", checkToken, async (req: any, res: any) => {
  upload(req, res, async (err: any) => {
    if (err) {
      return res.json({
        responseCode: 0,
        responseStatus: "error",
        responseMessage: "Error occured while uploading files",
        data: {},
      });
    }
    await updatePlot(req, res);
  });
});

router.get("/getallplots", checkToken, readAllPlots);
router.get("/getallplotsmobile", checkToken, readAllPlotsMobile);
router.patch("/deleteplotbyid", checkToken, deleteOnePlot);
export default router;

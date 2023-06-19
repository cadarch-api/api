import connectDb from "./config/db";
import path from "path";
import dotenv from "dotenv";
const cors = require("cors");
import bodyParser from "body-parser";
import { sendNewsNotifications } from './config/cronJobs'


import express, { Request, Response, NextFunction } from "express";
//Import Routes
import UserRouter from "./routes/userRouter";
import MobileUserRouter from "./routes/mobileUserRouter";
import CostEstimatorRouter from "./routes/costestimatorRouter";
import QuestionRouter from "./routes/questionRouter";
import QuestionOptionsRouter from "./routes/questionOptionsRoute";
import RenovationRouter from "./routes/renovationRouter";
import ArchitectureRouter from "./routes/architectureRouter";
import ConstructionRouter from "./routes/constructionRouter";
import DependenciesRouter from "./routes/dependenciesRouter";
import SupportRouter from "./routes/supportRouter";
import NewsRouter from "./routes/newsRouter";
import PlotRouter from "./routes/plotsRouter";
import DashboardRouter from "./routes/dashboardRouter";
import BasePriceRouter from "./routes/basePriceRouter";

import { MobileUser } from "./models/modileUserModel";
import { sendNotificationSingleDevice } from "./config/notification";
const PORT = process.env.PORT || 5000;
//Express instance
const app = express();

//Express instance configration
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
dotenv.config();
//db connection
connectDb();

//Routes
app.use("/api/users", UserRouter);
app.use("/api/mobileUsers", MobileUserRouter);
app.use("/api/costestimator", CostEstimatorRouter);
app.use("/api/question", QuestionRouter);
app.use("/api/questionOption", QuestionOptionsRouter);
app.use("/api/renovation", RenovationRouter);
app.use("/api/architecture", ArchitectureRouter);
app.use("/api/construction", ConstructionRouter);
app.use("/api/dependencies", DependenciesRouter);
app.use("/api/support", SupportRouter);
app.use("/api/news", NewsRouter);
app.use("/api/plot", PlotRouter);
app.use("/api/dashboard", DashboardRouter);
app.use("/api/baseprice", BasePriceRouter);


app.use(express.static("public"));
// app.use(express.static(path.join(__dirname, 'public')))

//Api Calls
app.use("/api", async (req: any, res: Response, next: NextFunction) => {
  // const user =await MobileUser.findOne({_id:req.query.userId},{_id:0},{fcmToken:1})
  // console.log(user.fcmToken)
  // const afterSending = await sendNotificationSingleDevice(user.fcmToken)
  // console.log(afterSending , " :sent")
  return res.send("Welcome To Cadarch Api");
});

//cronjobs
sendNewsNotifications()


//App listening
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));

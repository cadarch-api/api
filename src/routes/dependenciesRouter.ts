import express from "express";
const router = express.Router();
import {
  addDependencies,
  getDependencies,
  updateDependency,
  deleteDependency,
} from "../controllers/dependenciesControllers";
router.post("/addDependencies", addDependencies);
router.patch("/updateDependencybyid", updateDependency);
router.patch("/deleteDependencybyid", deleteDependency);
router.get("/getDependencies", getDependencies);
export default router;

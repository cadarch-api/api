import { DependenciesInterface } from "../models/dependenciesModel";
import {
  addDependenciesUtil,
  getDependenciesUtil,
  updateDependencyUtil,
  deleteDependencyUtil,
} from "../utils/dependenciesUtil";

const addDependencies = async (req: any, res: any) => {
  try {
    if (req.body) {
      console.log(req.body, "dependencies body");
      let dependencies: DependenciesInterface[] = req?.body ? req.body : null;
      let response = await addDependenciesUtil(dependencies);
      res.json(response);
    }
  } catch (err) {
    console.log(err);
  }
};
const updateDependency = async (req: any, res: any) => {
  try {
    if (req.body) {
      //   const id = req.query.id;
      //   let dependencies: DependenciesInterface[] = req?.body ? req.body : null;
      let dependencies = req?.body ? req.body : null;
      let response = await updateDependencyUtil(dependencies);
      res.json(response);
    }
  } catch (err) {
    console.log(err);
  }
};

const deleteDependency = async (req: any, res: any) => {
  try {
    if (req.body) {
      const id = req.query.id;
      // let dependency: DependenciesInterface = req?.body ? req.body : null;
      let response = await deleteDependencyUtil(id);
      res.json(response);
    }
  } catch (err) {
    console.log(err);
  }
};

const getDependencies = async (req: any, res: any) => {
  try {
    let response = await getDependenciesUtil();
    res.json(response);
  } catch (err) {
    console.log(err);
  }
};

export { addDependencies, getDependencies, updateDependency, deleteDependency };

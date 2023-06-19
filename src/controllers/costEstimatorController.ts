import { Request, Response } from "express";
import { CostEstimatorInterface} from "../models/costEstimatorModel";
import { addCostEstimatorUtil, readAllCostEstimatorUtil,deleteOneCostEstimatorUtil ,readOneCostEstimatorUtil} from '../utils/costEstimatorUtil';
const addCostEstimator = async (req: Request, res: Response) => {
    try {
        if (req.body) {
            let costEstimator: CostEstimatorInterface = req.body;
            let response = await addCostEstimatorUtil(costEstimator);
            res.json(response);

        }
    } catch (error) { console.log(error) }

}


const deleteCostEstimator = async (req: Request, res: Response) => {
    try {
        if (req.query.id) {
            let response = await deleteOneCostEstimatorUtil(req);
            res.json(response);

        }
    } catch (error) { console.log(error) }

}

const readAllCostEstimator = async (req: any, res: any) => {
    try {
        let response = await readAllCostEstimatorUtil(req, res);
        res.json(response);
    } catch (err) { console.log(err) }
}

const readOneCostEstimator = async (req: any, res: any) => {
    try {
        let response = await readOneCostEstimatorUtil(req, res);
        res.json(response);
    } catch (err) { console.log(err) }
}





export { addCostEstimator, readAllCostEstimator,deleteCostEstimator,readOneCostEstimator }

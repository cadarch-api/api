import { ConstructionInterface } from '../models/constructionModel';
import { sendArchitectureOrderNotificationUtil } from '../utils/architectureUtil';
import {
    addConstructionUtil,
    readAllConstructionUtil,
    getOneConstructionUtil,
    deleteOneConstructionUtil,
    updateOneConstructionUtil,
    readAllPaginatedConstructionUtil,
    readAllPaginatedConstructionHistoryUtil,
    sendConstructionOrderNotificationUtil
} from '../utils/constructionUtil';

const addConstruction = async (req: any, res: any) => {
    try {
        if (req.body) {
            console.log(req.body, "construction body")
            let construction: ConstructionInterface = req.body
            let response = await addConstructionUtil(req, res, construction);
            res.json(response);
        }
    } catch (err) { console.log(err) }

}

const updateOneConstruction = async (req: any, res: any) => {
    try {
        let id = req.query.id;
        let response = await updateOneConstructionUtil(req, res, id);
        res.json(response);
    } catch (err) { console.log(err) }
}
const readAllConstruction = async (req: any, res: any) => {
    try {
        let response = await readAllConstructionUtil();
        res.json(response);
    } catch (err) { console.log(err) }
}

const getOneConstruction = async (req: any, res: any) => {
    try {
        let id = req.query.id;
        let response = await getOneConstructionUtil(id);
        res.json(response);
    } catch (err) { console.log(err) }
}

const deleteOneConstruction = async (req: any, res: any) => {
    try {
        let id = req.query.id;
        let response = await deleteOneConstructionUtil(id);
        res.json(response);
    } catch (err) { console.log(err) }
}

const readAllPaginatedConstruction = async (req: any, res: any) => {
    try {
        let response = await readAllPaginatedConstructionUtil(req);
        res.json(response);
    } catch (err) { console.log(err) }
}

const readAllPaginatedConstructionHistory = async (req: any, res: any) => {
    try {
        let response = await readAllPaginatedConstructionHistoryUtil(req);
        res.json(response);
    } catch (err) { console.log(err) }
}

const sendOrderNotification = async (req: any, res: any) => {
    try {

        let response = await sendConstructionOrderNotificationUtil(req, res);
        res.json(response);
    } catch (err) { console.log(err) }
}



export { addConstruction, readAllConstruction, getOneConstruction, deleteOneConstruction, updateOneConstruction, readAllPaginatedConstructionHistory, readAllPaginatedConstruction, sendOrderNotification }
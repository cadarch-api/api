import { ArchitectureInterface } from '../models/architectureModel';
import {
    addArchitectureUtil,
    readAllArchitectureUtil,
    getOneArchitectureUtil,
    deleteOneArchitectureUtil,
    updateOneArchitectureUtil,
    readAllPaginatedArchitectureHistoryUtil,
    readAllPaginatedArchitectureUtil,
    sendArchitectureOrderNotificationUtil
} from '../utils/architectureUtil';

const addArchitecture = async (req: any, res: any) => {
    try {
        if (req.body) {
            console.log(req.body, "architecture body")
            let architecture: ArchitectureInterface = req.body
            let response = await addArchitectureUtil(req, res, architecture);
            res.json(response);
        }
    } catch (err) { console.log(err) }

}

const readAllArchitecture = async (req: any, res: any) => {
    try {
        let response = await readAllArchitectureUtil();
        res.json(response);
    } catch (err) { console.log(err) }
}

const getOneArchitecture = async (req: any, res: any) => {
    try {
        let id = req.query.id;
        let response = await getOneArchitectureUtil(id);
        res.json(response);
    } catch (err) { console.log(err) }
}

const updateOneArchitecture = async (req: any, res: any) => {
    try {
        let id = req.query.id;
        let response = await updateOneArchitectureUtil(req, res, id);
        res.json(response);
    } catch (err) { console.log(err) }
}

const sendOrderNotification = async (req: any, res: any) => {
    try {

        let response = await sendArchitectureOrderNotificationUtil(req, res);
        res.json(response);
    } catch (err) { console.log(err) }
}

const deleteOneArchitecture = async (req: any, res: any) => {
    try {
        let id = req.query.id;
        let response = await deleteOneArchitectureUtil(id);
        res.json(response);
    } catch (err) { console.log(err) }
}
const readAllPaginatedArchitecture = async (req: any, res: any) => {
    try {
        let response = await readAllPaginatedArchitectureUtil(req);
        res.json(response);
    } catch (err) { console.log(err) }
}

const readAllPaginatedArchitectureHistory = async (req: any, res: any) => {
    try {
        let response = await readAllPaginatedArchitectureHistoryUtil(req);
        res.json(response);
    } catch (err) { console.log(err) }
}



export { addArchitecture, readAllArchitecture, getOneArchitecture, deleteOneArchitecture, updateOneArchitecture, readAllPaginatedArchitecture, readAllPaginatedArchitectureHistory, sendOrderNotification }
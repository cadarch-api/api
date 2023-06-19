import { SupportInterface } from '../models/supportModel';
import { addSupportUtil, readAllSupportUtil, deleteOneSupportUtil,filterSupportUtil } from '../utils/supportUtil';

const addSupport = async (req: any, res: any) => {
    try {
        if (req.body) {
            let Support: SupportInterface = req?.body ? req.body : null;
            let response = await addSupportUtil(Support);
            res.json(response);
        }
    } catch (err) { console.log(err) }

}
const readAllSupport = async (req: any, res: any) => {
    try {
        let response = await readAllSupportUtil();
        res.json(response);
    } catch (err) { console.log(err) }
}
const deleteOneSupport = async (req: any, res: any) => {
    try {
        let id = req.query.id;
        let response = await deleteOneSupportUtil(id);
        res.json(response);
    } catch (err) { console.log(err) }
}
const filterSupport = async (req: any, res: any) => {
    try {
        let filter = req.query.filter;
        let response = await filterSupportUtil(filter);
        res.json(response);
    } catch (err) { console.log(err) }
}

export { addSupport, readAllSupport, deleteOneSupport,filterSupport }
import { BasePriceInterface } from '../models/basePriceModel';
import { addBasePriceUtil, readAllBasePriceUtil, deleteOneBasePriceUtil,toggleBasePriceUtil } from '../utils/basePriceUtil';

const addBasePrice = async (req: any, res: any) => {
    try {
        if (req.body) {
            let Support: BasePriceInterface = req?.body ? req.body : null;
            let response = await addBasePriceUtil(Support);
            res.json(response);
        }
    } catch (err) { console.log(err) }

}
const readAllBasePrice = async (req: any, res: any) => {
    try {
        let response = await readAllBasePriceUtil();
        res.json(response);
    } catch (err) { console.log(err) }
}
const deleteOneBasePrice = async (req: any, res: any) => {
    try {
        let id = req.query.id;
        let response = await deleteOneBasePriceUtil(id);
        res.json(response);
    } catch (err) { console.log(err) }
}
const toggleBasePrice = async (req: any, res: any) => {
    try {
        let id = req.body.id;
        let value = req.body.value
        let response = await toggleBasePriceUtil(id,value);
        res.json(response);
    } catch (err) { console.log(err) }
}

export { addBasePrice, readAllBasePrice, deleteOneBasePrice ,toggleBasePrice}
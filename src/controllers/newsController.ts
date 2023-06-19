import { NewsInterface } from '../models/newsModel';
import { addNewsUtil, readAllNewsUtil, deleteOneNewsUtil ,updateNewsUtil} from '../utils/newsUtil';

const addNews = async (req: any, res: any) => {
    try {
        if (req.body) {
            let news: NewsInterface = req.body?.model ? JSON.parse(req.body.model) : null;
            let response =await addNewsUtil(req, res, news);
            res.json(response);
        }
    } catch (err) { console.log(err) }

}
const updateNews = async (req: any, res: any) => {
    try {
        if (req.body) {
            let news: NewsInterface = req.body?.model ? JSON.parse(req.body.model) : null;
            let response =await updateNewsUtil(req, res, news);
            res.json(response);
        }
    } catch (err) { console.log(err) }

}
const readAllNews = async (req: any, res: any) => {
    try {
        let response = await readAllNewsUtil();
        res.json(response);
    } catch (err) { console.log(err) }
}
const deleteOneNews = async (req: any, res: any) => {
    try {
        let id = req.query.id;
        let response = await deleteOneNewsUtil(id);
        res.json(response);
    } catch (err) { console.log(err) }
}
export { addNews, readAllNews, deleteOneNews ,updateNews}
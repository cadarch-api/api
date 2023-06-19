import { PlotsInterface} from '../models/plotsModel';
import { addPlotUtil, readAllPlotsUtil, deleteOnePlotUtil,updatePlotUtil, readAllPlotsMobileUtil } from '../utils/plotUtil';

const addPlot = async (req: any, res: any) => {
    try {
        if (req.body) {
            let plot: PlotsInterface = req?.body?.model ? JSON.parse(req.body.model):null;
            let response = await addPlotUtil(req,res,plot);
            res.json(response);
        }
    } catch (err) { console.log(err) }

}

const updatePlot = async (req: any, res: any) => {
    try {
        if (req.body) {
            let plot: PlotsInterface = req.body?.model ? JSON.parse(req.body.model) : null;
            let response =await updatePlotUtil(req, res, plot);
            res.json(response);
        }
    } catch (err) { console.log(err) }

}

const readAllPlots = async (req: any, res: any) => {
    try {
        let response = await readAllPlotsUtil();
        res.json(response);
    } catch (err) { console.log(err) }
}

const readAllPlotsMobile = async (req: any, res: any) => {
    try {
        let response = await readAllPlotsMobileUtil();
        res.json(response);
    } catch (err) { console.log(err) }
}

const deleteOnePlot = async (req: any, res: any) => {
    try {
        let id = req.query.id;
        let response = await deleteOnePlotUtil(id);
        res.json(response);
    } catch (err) { console.log(err) }
}
export { addPlot, readAllPlots, deleteOnePlot,updatePlot,readAllPlotsMobile }
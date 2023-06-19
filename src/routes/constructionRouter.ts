import express from 'express';
const router = express.Router();
import { getUpload } from '../config/multerHelper';
import { checkToken } from '../middlewares/token';
import {
    addConstruction,
    readAllConstruction,
    getOneConstruction,
    deleteOneConstruction,
    updateOneConstruction,
    readAllPaginatedConstruction,
    readAllPaginatedConstructionHistory,
    sendOrderNotification
} from '../controllers/constructionController';

const upload = getUpload('construction');

router.post('/addconstruction', checkToken,addConstruction)
router.get('/loadallconstruction', checkToken, readAllConstruction);
router.post("/sendOrderNotification", checkToken, sendOrderNotification);
router.get('/getallpaginatedconstruction', checkToken, readAllPaginatedConstruction);
router.get('/getallpaginatedconstructionhistory', checkToken, readAllPaginatedConstructionHistory);
router.delete('/getconstructionbyid', checkToken, getOneConstruction);
router.patch('/updateconstruction', checkToken, updateOneConstruction);
router.delete('/deleteconstructionbyid', checkToken, deleteOneConstruction);

export default router;
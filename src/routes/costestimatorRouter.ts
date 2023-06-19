import express from 'express';
const router = express.Router();
import { getUpload } from '../config/multerHelper';
import { checkToken } from '../middlewares/token';
import { addCostEstimator, readAllCostEstimator, deleteCostEstimator, readOneCostEstimator } from '../controllers/costEstimatorController';


const upload = getUpload('costEstimator');

router.post('/addcostestimator', checkToken, addCostEstimator);
router.get('/loadallcostestimator', checkToken, readAllCostEstimator);
router.get('/loadonecostestimator', checkToken, readOneCostEstimator);
router.patch('/deletecostestimator', checkToken, deleteCostEstimator);
export default router;
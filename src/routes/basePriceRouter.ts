import express from 'express';
const router = express.Router();
import { checkToken } from '../middlewares/token';
import { addBasePrice,deleteOneBasePrice,readAllBasePrice,toggleBasePrice } from '../controllers/basePriceController';

router.post('/addbaseprice', checkToken, addBasePrice)
router.get('/readallbaseprice', checkToken , readAllBasePrice);
router.patch('/togglebaseprice', checkToken, toggleBasePrice);
router.patch('/deletebasepricebyid', checkToken, deleteOneBasePrice);


export default router;
import express from 'express';
const router = express.Router();
import { checkToken } from '../middlewares/token';
import { addSupport,deleteOneSupport,readAllSupport,filterSupport } from '../controllers/supportController';

router.post('/addsupport', checkToken, addSupport)
router.get('/filtersupport', checkToken , filterSupport);
router.get('/loadallsupport', checkToken, readAllSupport);
router.patch('/deletesupportbyid', checkToken, deleteOneSupport);


export default router;
import express from 'express';
const router = express.Router();
import { checkToken } from '../middlewares/token';
import {readDashboardData,readAllByMonth } from '../controllers/dashboardController';

router.get('/getallcounteddocuments' , readDashboardData)
router.get('/getallusersbymonth',readAllByMonth)

export default router
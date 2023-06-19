import {getAllDashboardDataUtil ,getAllUsersByMonth} from '../utils/dashboardUtil'
//dashboard apis
const readDashboardData = async (req: Request, res: any) => {
    try {
      let dashboadData = await getAllDashboardDataUtil();
      res.json(dashboadData);
    } catch (error) {
      console.log(error);
    }
  }
  const readAllByMonth = async (req: Request, res: any) => {
  
    try {
      let usersList = await getAllUsersByMonth();
      res.json(usersList);
    } catch (error) {
      console.log(error);
    }
  }
  export {readDashboardData,readAllByMonth }
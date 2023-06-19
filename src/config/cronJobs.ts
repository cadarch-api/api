const schedule = require('node-schedule')
import { MobileUser } from "../models/modileUserModel";
import { News } from "../models/newsModel";
import { db } from "./db";
import { sendNotificationMultipleDevices } from "./notification";

//time 300
export const sendNewsNotifications = async () => {
  schedule.scheduleJob('0 */30 * * * *', async () => {
    if (db.readyState === 1) {
      try{
        const promises = await Promise.all([
          MobileUser.find({ phoneOtp: "####", fcmToken: { $ne: "#" } }, { _id: 0, fcmToken: 1 }),
          News.find({ isNotified: false, isDeleted: false }, { title: 1 })
        ])
        const users = promises[0]
        const news = promises[1]
        let fcmTokens = []
        for (let i = 0; i < users.length; i++) {
          if (users[i]?.fcmToken && users[i]?.fcmToken !== '') {
            fcmTokens.push(users[i].fcmToken)
          }
        }
        for (let j = 0; j < news.length; j++) {
          if(news[j]?.title && news[j]?.title !== '' ){
            await sendNotificationMultipleDevices(fcmTokens, news[j].title)
            await News.findOneAndUpdate({_id:news[j]._id} , {isNotified:true})
          }
        }
      }
      catch(e){
        console.log(e , "exception occurred")
      }
  
    }
    else {
      console.log('db not connected yet')
    }
  })
}

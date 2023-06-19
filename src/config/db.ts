import mongoose from "mongoose";
export const db = mongoose.connection;
const connectDb = async()=>{
    var CONNECTION_URL = 'mongodb+srv://codefrenetics:codefrenetics@cadarch.dcyogmr.mongodb.net/?retryWrites=true&w=majority'
    // var CONNECTION_URL = 'mongodb+srv://cadarch:admincadarch@cluster0.jmemk3y.mongodb.net/test';
    //above is cadarch new db
   mongoose.connect(CONNECTION_URL, { keepAliveInitialDelay: 300000 });
    // mongoose.connect(CONNECTION_URL, { useUnifiedTopology: true });
    
    
    db.on('connected', () => {
        console.log('Succesfully connected to database')
    
    })
    db.on('error', (error) => {
        console.log(`Error occured connecting to database: ${error.message}`)
    })
}

export default connectDb
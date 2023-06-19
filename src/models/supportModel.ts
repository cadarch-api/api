import mongoose from 'mongoose';
interface SupportInterface {
    userId: mongoose.Schema.Types.ObjectId
    type: string
    name: string
    email: string
    message:string
    isDeleted:boolean
}

const SupportSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MobileUser',
            required:true
        },
        type: {
            type: String,
            required: true,
            lowercase:true
        },
        name: {
            type: String,
            required: true,
            lowercase:true
        },
        email: {
            type: String,
            required: true,
            lowercase:true
        },
        message: {
            type: String,
            required: true
        },
        isDeleted:{
            type:Boolean,
            default:false
          }
    },
    {timestamps:true}
)

const Support = mongoose.model('Support', SupportSchema)

export { SupportInterface, Support }
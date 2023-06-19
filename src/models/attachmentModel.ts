import mongoose from 'mongoose';

export interface AttachmentInterface {
    userId: mongoose.Types.ObjectId;
    path: string;
    type: string;
    isDeleted:boolean
}

const AttachmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref:'MobileUser',
        required: false
    },
    path: {
        type: String,
        required: false
    },
    type: {
        type: String,
        required: false
    },
    isDeleted:{
        type:Boolean,
        default:false
      }
},
    { timestamps: { createdAt: true, updatedAt: true } }
);

export const Attachment = mongoose.model('Attachment', AttachmentSchema);


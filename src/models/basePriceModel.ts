import mongoose from 'mongoose';

export interface BasePriceInterface {
    _id: mongoose.Types.ObjectId;
    basePrice: string;
    isDeleted:boolean
    isActive:boolean
}

const BasePriceSchema = new mongoose.Schema({
    basePrice: {
        type: String,
        required: true
    },
    isDeleted:{
        type:Boolean,
        default:false
      },
    isActive:{
        type:Boolean,
        required:true
    }
},
    { timestamps: { createdAt: true, updatedAt: true } }
);

export const BasePrice = mongoose.model('BasePrice', BasePriceSchema);


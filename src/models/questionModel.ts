import mongoose from 'mongoose';
import { QuestionOptionInterface } from './questionOptionModel';

interface QuestionInterface {
    _id:string
    title: string;
    details: string;
    isBasic: boolean;
    isDeleted: boolean;
    isDependent: boolean;
    displayOrder: number;
    createdBy: number;
    updatedBy: number;
    // questionOptions: [];
}
export interface QuestionViewInterface {
    title: string;
    details: string;
    isBasic: boolean;
    isDeleted: boolean;
    isDependent: boolean;
    displayOrder: number;
    createdBy: number;
    updatedBy: number;
    // questionOptions?: Array<QuestionOptionInterface>;
}
const QuestionSchema = new mongoose.Schema({
 
    title: {
        type: String,
        allowNull: true
    },
    details: {
        type: String,
        allowNull: true
    },
    isBasic: {
        type: Boolean,
        allowNull: true
    },
    displayOrder: {
        type: Number,
        allowNull: true
    },
    isDeleted: {
        type: Boolean,
        allowNull: true,
        default: false
    },
    isDependent: {
        type: Boolean,
        allowNull: true,
        default: false
    },
    CreatedBy: {
        type: Number,
        allowNull: true
    },
    UpdatedBy: {
        type: Number,
        allowNull: true
    }
},
    { timestamps: { createdAt: true, updatedAt: true } }
);

const Question = mongoose.model('Question', QuestionSchema);

export { QuestionInterface, Question };
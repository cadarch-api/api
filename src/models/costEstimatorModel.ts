import mongoose from 'mongoose';
interface CostEstimatorInterface {
    userId: mongoose.Schema.Types.ObjectId
    totalEstimate: number
    details: Array<DetailsInterface>
    isDeleted: boolean
}
interface DetailsInterface {
    questionId: Array<mongoose.Schema.Types.ObjectId>
    optionId: Array<mongoose.Schema.Types.ObjectId>
}

const CostEstimatorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MobileUser',
        required: true
    },
    totalEstimate: {
        type: Number,
        required: true
    },
    details: [{
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question'
        },
        optionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'QuestionOption'
        }
    }],
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: { createdAt: true, updatedAt: true } }
);

const CostEstimator = mongoose.model('CostEstimator', CostEstimatorSchema);

export { CostEstimatorInterface, CostEstimator };




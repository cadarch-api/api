import mongoose from 'mongoose';
interface NewsInterface {
    userId: mongoose.Schema.Types.ObjectId
    title: string
    description: string
    attachmentsPath: Object[];
    isDeleted: boolean
}

const NewsSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        title: {
            type: String,
            required: true
        },
        details: {
            type: String,
            required: true
        },
        attachmentsPath: [{
            type: mongoose.Types.ObjectId,
            ref: 'Attachment'
        }],
        isDeleted: {
            type: Boolean,
            default: false
        },
        isNotified: {
            type: Boolean,
            default: 'false'
        }
    }, { timestamps: true }
)

const News = mongoose.model('News', NewsSchema)

export { NewsInterface, News }
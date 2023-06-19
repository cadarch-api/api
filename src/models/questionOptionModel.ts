import mongoose, { Types } from "mongoose";

// QuestionOption Interface
interface QuestionOptionInterface {
  questionId: Object;
  title: string;
  details: string;
  isActive: boolean;
  isDeleted: boolean;
  image: Array<string>;
  priceEffectPSF: number;
  displayOrder: number;
  createdBy: number;
  updatedBy: number;
}

const QuestionOptionModel = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Types.ObjectId,
      allowNull: true,
      ref: "CostEstimator",
      index:true
    },
    title: {
      type: String,
      allowNull: true,
    },
    details: {
      type: String,
      allowNull: true,
    },
    image: [String],
    priceEffectPSF: {
      type: Number,
      allowNull: true,
      defaultValue: 0,
    },
    isActive: {
      type: Boolean,
      allowNull: true,
      defaultValue: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Number,
      allowNull: true,
    },
    updatedBy: {
      type: Number,
      allowNull: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

const QuestionOption = mongoose.model("QuestionOption", QuestionOptionModel);

export { QuestionOptionInterface, QuestionOption };

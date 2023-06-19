import mongoose from "mongoose";
interface ConstructionInterface {
  userId: mongoose.Types.ObjectId;
  constructionType: string;
  constructionTypeOption: string[];
  details?: string;
  area?: number;
  audioFile?: string;
  address: string;
  location: Object;
  isFollowUp: boolean;
  commnets: string;
  attachmentsPath: Object[];
  isDeleted: boolean;
}

const ConstructionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    orderType: {
      type: String,
      default: "construction",
    },
    constructionType: String,
    constructionTypeOption: [String],
    area: {
      type:Number,
      default:0
    },
    audioFile: String,
    details: String,
    address: String,
    isFollowUp: { type: Boolean, default: false },
    isNotified: { type: Boolean, default: false },
    comments: { type: String, default: "" },
    location: { type: [Object], blackbox: true },
    attachmentsPath: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Attachment",
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Construction = mongoose.model("Construction", ConstructionSchema);

export { ConstructionInterface, Construction };

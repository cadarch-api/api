import mongoose, { Mongoose } from "mongoose";
interface RenovationInterface {
  userId: mongoose.Types.ObjectId;
  renovationType: string;
  details?: string;
  audioFile?: string;
  area?: number;
  address: string;
  isFollowUp: boolean;
  commnets: string;
  location: Object;
  orderType: string;
  attachmentsPath: Object[];
  isDeleted: boolean;
}

export interface LocationDetails {
  locationType: string;
  coordinates: number[];
}
const RenovationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    renovationType: String,
    details: String,
    audioFile: String,
    orderType: {
      type: String,
      default: "renovation",
    },
    area: {
      type:Number,
      default:0
    },
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

const Renovation = mongoose.model("Renovation", RenovationSchema);

export { RenovationInterface, Renovation };

import mongoose from "mongoose";
interface ArchitectureInterface {
  userId: mongoose.Types.ObjectId;
  architectureType: string;
  architectureTypeOptionsList: string[];
  details?: string;
  audioFile?: string;
  address: string;
  isFollowUp: boolean;
  commnets: string;
  location: Object;
  attachmentsPath: Object[];
  isDeleted: boolean;
}
export interface LocationDetails {
  locationType: string;
  coordinates: number[];
}
const ArchitectureSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    orderType: {
      type: String,
      default: "architecture",
    },
    architectureType: String,
    architectureTypeOptionsList: [],
    details: String,
    audioFile: String,
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

const Architecture = mongoose.model("Architecture", ArchitectureSchema);

export { ArchitectureInterface, Architecture };

import mongoose from "mongoose";
interface PlotsInterface {
  title: string;
  size: number;
  unit: string;
  length: number;
  width: number;
  isDeleted: boolean;
  coveredAreaWithBasement: number;
  coveredArea: number;
  attachmentsPath: Object[];
}

const PlotsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    length: {
      type: Number,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    coveredArea: {
      type: Number,
      required: true,
    },
    coveredAreaWithBasement: {
      type: Number,
      required: true,
    },
    attachmentsPath: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Attachment",
      },
    ],
  },
  { timestamps: true }
);

const Plot = mongoose.model("Plot", PlotsSchema);

export { PlotsInterface, Plot };

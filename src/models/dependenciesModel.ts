import mongoose from "mongoose";

interface DependenciesInterface {
  _id?: string;
  dependentQuestion: {
    title: string;
    id: string;
  };
  dependsOnQuestion: {
    title: string;
    id: string;
  };
  dependsOnOptions: [
    {
      title: string;
      id: string;
    }
  ];
  isDeleted: boolean;
}

const DependenciesSchema = new mongoose.Schema(
  {
    dependentQuestion: {
      title: {
        type: String,
        required: true,
      },
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true,
        index:true
      },
    },
    dependsOnQuestion: {
      title: {
        type: String,
        required: true,
      },
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true,
        index:true
      },
    },
    dependsOnOptions: [
      {
        title: {
          type: String,
          required: true,
        },
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "QuestionOption",
          required: true,
          index:true
        },
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

const Dependencies = mongoose.model("Dependencies", DependenciesSchema);

export { DependenciesInterface, Dependencies };

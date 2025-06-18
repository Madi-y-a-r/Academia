import { Schema, model } from "dynamoose";

const ratingSchema = new Schema(
  {
    ratingId: {
      type: String,
      hashKey: true,
      required: true,
    },
    courseId: {
      type: String,
      required: true,
      index: {
        name: "courseIdIndex",
        type: "global",
        project: true,
        throughput: { read: 5, write: 5 }
      }
    },
    userId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      validate: (value: any) => typeof value === 'number' && value >= 1 && value <= 5,
    },
    comment: {
      type: String,
      required: false,
      validate: (value: any) => !value || (typeof value === 'string' && value.length <= 1000),
    },
    helpfulCount: {
      type: Number,
      default: 0,
    },
    helpfulVotes: {
      type: Array,
      schema: [String], // массив userId тех кто отметил как полезный
      default: []
    }
  },
  {
    timestamps: true,
  }
);

// No additional indexes needed, using courseId and userId from schema

const Rating = model("Rating", ratingSchema);
export default Rating;
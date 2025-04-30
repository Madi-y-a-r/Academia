import { Schema, model } from "dynamoose";

const meetingSchema = new Schema(
  {
    meetingId: {
      type: String,
      hashKey: true,
      required: true,
    },
    courseId: {
      type: String,
      required: true,
      index: {
        name: "CourseMeetingsIndex",
        type: "global",
      },
    },
    teacherId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    meetUrl: {
      type: String,
      required: true,
    },
    scheduledStartTime: {
      type: String,
      required: true,
    },
    scheduledEndTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Scheduled", "Active", "Completed", "Cancelled"],
      default: "Scheduled",
    },
    participants: {
      type: Array,
      schema: [
        new Schema({
          userId: {
            type: String,
            required: true,
          },
          joinedAt: {
            type: String,
          },
          leftAt: {
            type: String,
          },
        }),
      ],
    },
  },
  {
    timestamps: true,
  }
);

const Meeting = model("Meeting", meetingSchema);
export default Meeting;
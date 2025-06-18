import { Schema, model } from "dynamoose";

const commentSchema = new Schema({
  commentId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: String,
    required: true,
  },
});

const chapterSchema = new Schema({
  chapterId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["Text", "Quiz", "Video"],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  comments: {
    type: Array,
    schema: [commentSchema],
  },
  video: {
    type: String,
  },
  teacherNotes: {
    type: String,
  },
  freePreview: {
    type: Boolean,
    default: false,
  },
  resources: {
    type: Array,
    schema: [new Schema({
      title: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
      description: {
        type: String,
      },
    })],
  },
});

const sectionSchema = new Schema({
  sectionId: {
    type: String,
    required: true,
  },
  sectionTitle: {
    type: String,
    required: true,
  },
  sectionDescription: {
    type: String,
  },
  chapters: {
    type: Array,
    schema: [chapterSchema],
  },
});

const courseSchema = new Schema(
  {
    courseId: {
      type: String,
      hashKey: true,
      required: true,
    },
    teacherId: {
      type: String,
      required: true,
    },
    teacherName: {
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
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    price: {
      type: Number,
    },
    level: {
      type: String,
      required: true,
      enum: ["Beginner", "Intermediate", "Advanced"],
    },
    status: {
      type: String,
      required: true,
      enum: ["Draft","Pending", "Published", "Rejected"],
      default: "Draft",
      index: {
        name: "statusIndex",
        type: "global",
        project: true, // проекция всех атрибутов
        throughput: { read: 5, write: 5 }
      }
    },
    adminComment: {
      type: String,
    },
    sections: {
      type: Array,
      schema: [sectionSchema],
    },
    enrollments: {
      type: Array,
      schema: [
        new Schema({
          userId: {
            type: String,
            required: true,
          },
        }),
      ],
    },
    averageRating: {
      type: Number,
      default: 0,
      validate: (value: any) => typeof value === 'number' && value >= 0 && value <= 5,
    },
    ratingCount: {
      type: Number,
      default: 0,
      validate: (value: any) => typeof value === 'number' && value >= 0,
    },
    ratingDistribution: {
      type: Array,
      schema: [Number], // [count1star, count2star, count3star, count4star, count5star]
      default: [0, 0, 0, 0, 0],
    },
  },
  {
    timestamps: true,
  }
);

const Course = model("Course", courseSchema);
export default Course;

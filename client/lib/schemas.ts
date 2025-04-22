import * as z from "zod";

// Course Editor Schemas
export const courseSchema = z.object({
  courseTitle: z.string().min(1, "Title is required"),
  courseDescription: z.string().min(1, "Description is required"),
  courseCategory: z.string().min(1, "Category is required"),
  coursePrice: z.string(),
  courseStatus: z.boolean(),
});

export type CourseFormData = z.infer<typeof courseSchema>;

// Chapter Schemas
export const chapterSchema = z.object({
  title: z.string().min(1, "Название раздела обязательно"),
  content: z.string().min(1, "Содержание раздела обязательно"),
  video: z.any().optional(),
  teacherNotes: z.string().optional(),
  resources: z.array(z.object({
    title: z.string(),
    url: z.string().url(),
    description: z.string().optional(),
  })).optional(),
});

export type ChapterFormData = z.infer<typeof chapterSchema>;

// Section Schemas
export const sectionSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

export type SectionFormData = z.infer<typeof sectionSchema>;

// Guest Checkout Schema
export const guestSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type GuestFormData = z.infer<typeof guestSchema>;

// Notification Settings Schema
export const notificationSettingsSchema = z.object({
  courseNotifications: z.boolean(),
  emailAlerts: z.boolean(),
  smsAlerts: z.boolean(),
  notificationFrequency: z.enum(["immediate", "daily", "weekly"]),
});

export type NotificationSettingsFormData = z.infer<
  typeof notificationSettingsSchema
>;

export const quizSchema = z.object({
  title: z.string().min(1, { message: "Quiz title is required" }),
  description: z.string().optional(),
  questions: z.array(
    z.object({
      questionId: z.string(),
      questionText: z.string().min(1, { message: "Question text is required" }),
      options: z.array(
        z.object({
          optionId: z.string(),
          text: z.string().min(1, { message: "Option text is required" }),
          isCorrect: z.boolean(),
        })
      ).min(2, { message: "At least two options are required" }),
      explanation: z.string().optional(),
    })
  ).min(1, { message: "At least one question is required" }),
  passingScore: z.number().min(0).max(100),
});

export type QuizFormData = z.infer<typeof quizSchema>;

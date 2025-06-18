import { z } from 'zod';

export const createCourseSchema = z.object({
  body: z.object({
    teacherId: z.string().min(1, "ID преподавателя обязателен"),
    teacherName: z.string().min(1, "Имя преподавателя обязательно")
  })
});

export const updateCourseSchema = z.object({
  params: z.object({
    courseId: z.string().min(1, "ID курса обязателен")
  }),
  body: z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().optional(),
    category: z.string().optional(),
    level: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
    price: z.number().min(0).optional(),
    tags: z.array(z.string()).optional(),
    status: z.enum(["Draft", "Published"]).optional()
  })
});

export const getCourseSchema = z.object({
  params: z.object({
    courseId: z.string().min(1, "ID курса обязателен")
  })
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;
export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
export type GetCourseInput = z.infer<typeof getCourseSchema>;
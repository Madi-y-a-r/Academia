import { z } from 'zod';

export const createRatingSchema = z.object({
  params: z.object({
    courseId: z.string().min(1, "ID курса обязателен")
  }),
  body: z.object({
    rating: z.number().int().min(1, "Рейтинг должен быть от 1").max(5, "Рейтинг должен быть до 5"),
    comment: z.string().max(1000, "Комментарий не должен превышать 1000 символов").optional()
  })
});

export const getRatingsSchema = z.object({
  params: z.object({
    courseId: z.string().min(1, "ID курса обязателен")
  }),
  query: z.object({
    page: z.string().regex(/^\d+$/, "Страница должна быть числом").optional(),
    limit: z.string().regex(/^\d+$/, "Лимит должен быть числом").optional(),
    sortBy: z.enum(["createdAt", "rating", "helpfulCount"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional()
  })
});

export const getUserRatingSchema = z.object({
  params: z.object({
    courseId: z.string().min(1, "ID курса обязателен")
  })
});

export const deleteRatingSchema = z.object({
  params: z.object({
    courseId: z.string().min(1, "ID курса обязателен"),
    ratingId: z.string().min(1, "ID рейтинга обязателен")
  })
});

export const markHelpfulSchema = z.object({
  params: z.object({
    ratingId: z.string().min(1, "ID рейтинга обязателен")
  })
});

export const getRatingStatsSchema = z.object({
  params: z.object({
    courseId: z.string().min(1, "ID курса обязателен")
  })
});

export type CreateRatingInput = z.infer<typeof createRatingSchema>;
export type GetRatingsInput = z.infer<typeof getRatingsSchema>;
export type GetUserRatingInput = z.infer<typeof getUserRatingSchema>;
export type DeleteRatingInput = z.infer<typeof deleteRatingSchema>;
export type MarkHelpfulInput = z.infer<typeof markHelpfulSchema>;
export type GetRatingStatsInput = z.infer<typeof getRatingStatsSchema>;
import express from "express";
import { requireAuth } from "@clerk/express";
import { validate } from "../middleware/validation";
import {
  getCourseRatings,
  getUserRating,
  createOrUpdateRating,
  deleteRating,
  markRatingHelpful,
  getCourseRatingStats
} from "../controllers/ratingController";
import {
  createRatingSchema,
  getRatingsSchema,
  getUserRatingSchema,
  deleteRatingSchema,
  markHelpfulSchema,
  getRatingStatsSchema
} from "../schemas/ratingSchemas";

const router = express.Router();

// Получить все рейтинги курса с пагинацией
router.get("/courses/:courseId/ratings", validate(getRatingsSchema), getCourseRatings);

// Получить статистику рейтингов курса
router.get("/courses/:courseId/ratings/stats", validate(getRatingStatsSchema), getCourseRatingStats);

// Получить рейтинг текущего пользователя для курса
router.get("/courses/:courseId/ratings/my", requireAuth(), validate(getUserRatingSchema), getUserRating);

// Создать или обновить рейтинг
router.post("/courses/:courseId/ratings", requireAuth(), validate(createRatingSchema), createOrUpdateRating);

// Удалить рейтинг
router.delete("/courses/:courseId/ratings/:ratingId", requireAuth(), validate(deleteRatingSchema), deleteRating);

// Отметить рейтинг как полезный/неполезный
router.post("/ratings/:ratingId/helpful", requireAuth(), validate(markHelpfulSchema), markRatingHelpful);

export default router;
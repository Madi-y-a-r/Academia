import { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { v4 as uuidv4 } from "uuid";
import Rating from "../models/ratingModel";
import Course from "../models/courseModel";

// Получить все рейтинги курса с пагинацией
export const getCourseRatings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;
    const { page = "1", limit = "10", sortBy = "createdAt", sortOrder = "desc" } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    let query = Rating.query("courseId").eq(courseId);
    
    // Сортировка
    if (sortBy === "helpfulCount") {
      query = query.sort("descending");
    } else if (sortBy === "rating") {
      query = query.sort(sortOrder === "asc" ? "ascending" : "descending");
    }

    const ratings = await query.limit(limitNum).exec();
    const countResult = await Rating.query("courseId").eq(courseId).count().exec();
    const totalCount = countResult.count;
    
    // Простая пагинация - возвращаем только запрошенное количество записей
    const paginatedRatings = ratings.slice(skip, skip + limitNum);

    res.json({
      message: "Ratings retrieved successfully",
      data: {
        ratings: paginatedRatings,
        totalCount,
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        hasNext: pageNum * limitNum < totalCount,
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving ratings", error });
  }
};

// Получить рейтинг пользователя для конкретного курса
export const getUserRating = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;
    const { userId } = getAuth(req);

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const rating = await Rating.query("courseId").eq(courseId).where("userId").eq(userId).exec();
    
    if (rating.length === 0) {
      res.json({ message: "No rating found", data: null });
      return;
    }

    res.json({ message: "Rating retrieved successfully", data: rating[0] });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user rating", error });
  }
};

// Создать или обновить рейтинг
export const createOrUpdateRating = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;
    const { rating: ratingValue, comment } = req.body;
    const { userId } = getAuth(req);

    console.log("Rating request data:", { courseId, ratingValue, comment, userId });

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    // Проверим, что курс существует
    const course = await Course.get(courseId);
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    // Проверим, что пользователь не является автором курса
    if (course.teacherId === userId) {
      res.status(403).json({ message: "Course authors cannot rate their own courses" });
      return;
    }

    // Проверим, есть ли уже рейтинг от этого пользователя
    const existingRatings = await Rating.query("courseId").eq(courseId).where("userId").eq(userId).exec();
    
    let savedRating;
    let isUpdate = false;

    if (existingRatings.length > 0) {
      // Обновляем существующий рейтинг
      const existingRating = existingRatings[0];
      isUpdate = true;
      
      await Rating.update(
        { ratingId: existingRating.ratingId },
        { 
          rating: ratingValue, 
          comment: comment || "",
          updatedAt: new Date().toISOString()
        }
      );
      
      savedRating = await Rating.get(existingRating.ratingId);
    } else {
      // Создаем новый рейтинг
      const newRating = new Rating({
        ratingId: uuidv4(),
        courseId,
        userId,
        userName: "Student", // Здесь можно получить имя из Clerk
        rating: ratingValue,
        comment: comment || "",
        helpfulCount: 0,
        helpfulVotes: []
      });
      
      savedRating = await newRating.save();
    }

    // Обновляем статистику курса
    await updateCourseRatingStats(courseId);

    res.status(isUpdate ? 200 : 201).json({
      message: isUpdate ? "Rating updated successfully" : "Rating created successfully",
      data: savedRating
    });
  } catch (error) {
    console.error("Rating creation error:", error);
    res.status(500).json({ message: "Error creating/updating rating", error: error instanceof Error ? error.message : error });
  }
};

// Удалить рейтинг
export const deleteRating = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseId, ratingId } = req.params;
    const { userId } = getAuth(req);

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const rating = await Rating.get(ratingId);
    if (!rating) {
      res.status(404).json({ message: "Rating not found" });
      return;
    }

    if (rating.userId !== userId) {
      res.status(403).json({ message: "Not authorized to delete this rating" });
      return;
    }

    await Rating.delete(ratingId);
    
    // Обновляем статистику курса
    await updateCourseRatingStats(courseId);

    res.json({ message: "Rating deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting rating", error });
  }
};

// Отметить рейтинг как полезный
export const markRatingHelpful = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ratingId } = req.params;
    const { userId } = getAuth(req);

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const rating = await Rating.get(ratingId);
    if (!rating) {
      res.status(404).json({ message: "Rating not found" });
      return;
    }

    const helpfulVotes = rating.helpfulVotes || [];
    
    if (helpfulVotes.includes(userId)) {
      // Убираем голос
      const updatedVotes = helpfulVotes.filter((id: string) => id !== userId);
      await Rating.update(
        { ratingId },
        { 
          helpfulVotes: updatedVotes,
          helpfulCount: updatedVotes.length
        }
      );
    } else {
      // Добавляем голос
      const updatedVotes = [...helpfulVotes, userId];
      await Rating.update(
        { ratingId },
        { 
          helpfulVotes: updatedVotes,
          helpfulCount: updatedVotes.length
        }
      );
    }

    const updatedRating = await Rating.get(ratingId);
    res.json({ message: "Rating helpfulness updated", data: updatedRating });
  } catch (error) {
    res.status(500).json({ message: "Error updating rating helpfulness", error });
  }
};

// Получить статистику рейтингов курса
export const getCourseRatingStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;

    const course = await Course.get(courseId);
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    res.json({
      message: "Rating stats retrieved successfully",
      data: {
        averageRating: course.averageRating || 0,
        ratingCount: course.ratingCount || 0,
        ratingDistribution: course.ratingDistribution || [0, 0, 0, 0, 0]
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving rating stats", error });
  }
};

// Вспомогательная функция для обновления статистики курса
const updateCourseRatingStats = async (courseId: string): Promise<void> => {
  try {
    const ratings = await Rating.query("courseId").eq(courseId).exec();
    
    if (ratings.length === 0) {
      await Course.update(
        { courseId },
        { 
          averageRating: 0,
          ratingCount: 0,
          ratingDistribution: [0, 0, 0, 0, 0]
        }
      );
      return;
    }

    const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating = totalRating / ratings.length;
    
    const distribution = [0, 0, 0, 0, 0];
    ratings.forEach(rating => {
      if (rating.rating >= 1 && rating.rating <= 5) {
        distribution[rating.rating - 1]++;
      }
    });

    await Course.update(
      { courseId },
      { 
        averageRating: Math.round(averageRating * 10) / 10, // Округляем до 1 знака
        ratingCount: ratings.length,
        ratingDistribution: distribution
      }
    );
  } catch (error) {
    console.error("Error updating course rating stats:", error);
  }
};
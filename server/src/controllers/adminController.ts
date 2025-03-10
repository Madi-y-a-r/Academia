import { Request, Response } from "express";
import Course from "../models/courseModel";


export const getPendingCourses = async (req: Request, res: Response) => {
  try {
    const pendingCourses = await Course.scan("status").eq("Pending").exec();
    res.json(pendingCourses);
  } catch (error) {
    res.status(500).json({ error: "Ошибка при получении курсов." });
  }
};


export const moderateCourse = async (req: Request, res: Response) => {
  try {
    const { courseId, action, comment } = req.body;

    if (!courseId || !action) {
      return res.status(400).json({ error: "Нужен courseId и действие." });
    }

    // Определяем новый статус
    let newStatus;
    if (action === "approve") {
      newStatus = "Published";
    } else if (action === "reject") {
      newStatus = "Rejected";
    } else {
      return res.status(400).json({ error: "Неверное действие." });
    }

    // Обновляем курс в DynamoDB
    await Course.update(
      { courseId },
      {
        status: newStatus,
        adminComment: action === "reject" ? comment || "Без комментария" : null,
      }
    );

    res.json({ message: `Курс ${newStatus}.` });
  } catch (error) {
    res.status(500).json({ error: "Ошибка модерации курса." });
  }
};

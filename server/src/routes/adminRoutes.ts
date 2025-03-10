import express from "express";
import { moderateCourse } from "../controllers/courseController";

const router = express.Router();

router.post("/moderate/:courseId", moderateCourse); // Админ одобряет/отклоняет курс

export default router;

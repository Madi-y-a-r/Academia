import express from "express";
import multer from "multer";
import {
  createCourse,
  deleteCourse,
  getCourse,
  listCourses,
  updateCourse,
  getUploadVideoUrl,
} from "../controllers/courseController";
import { requireAuth } from "@clerk/express";
import { validate } from "../middleware/validation";
import { createCourseSchema, updateCourseSchema, getCourseSchema } from "../schemas/courseSchemas";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", listCourses);
router.post("/", requireAuth(), validate(createCourseSchema), createCourse);

router.get("/:courseId", validate(getCourseSchema), getCourse);
router.put("/:courseId", requireAuth(), validate(updateCourseSchema), upload.single("image"), updateCourse);
router.delete("/:courseId", requireAuth(), validate(getCourseSchema), deleteCourse);

router.post(
  "/:courseId/sections/:sectionId/chapters/:chapterId/get-upload-url",
  requireAuth(),
  getUploadVideoUrl
);

export default router;
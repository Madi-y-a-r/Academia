// server/src/routes/meetingRoutes.ts
import express from "express";
import { requireAuth } from "@clerk/express";
import {
  createMeeting,
  getMeetings,
  getMeeting,
  updateMeeting,
  deleteMeeting,
  joinMeeting,
} from "../controllers/meetingController";

const router = express.Router();

router.post("/", requireAuth(), createMeeting);
router.get("/course/:courseId", requireAuth(), getMeetings);
router.get("/:meetingId", requireAuth(), getMeeting);
router.put("/:meetingId", requireAuth(), updateMeeting);
router.delete("/:meetingId", requireAuth(), deleteMeeting);
router.post("/:meetingId/join", requireAuth(), joinMeeting);

export default router;
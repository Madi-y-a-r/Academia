// server/src/controllers/meetingController.ts
import { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { v4 as uuidv4 } from "uuid";
import Meeting from "../models/meetingModel";
import Course from "../models/courseModel";

export const createMeeting = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = getAuth(req);
  const { courseId, title, description, scheduledStartTime, scheduledEndTime, meetUrl } = req.body;

  try {
    // Проверка, является ли пользователь учителем курса
    const course = await Course.get(courseId);
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    if (course.teacherId !== userId) {
      res.status(403).json({ message: "Not authorized to create meetings for this course" });
      return;
    }

    const newMeeting = new Meeting({
      meetingId: uuidv4(),
      courseId,
      teacherId: userId,
      title,
      description,
      meetUrl,
      scheduledStartTime,
      scheduledEndTime,
      status: "Scheduled",
      participants: [],
    });

    await newMeeting.save();

    res.status(201).json({ message: "Meeting created successfully", data: newMeeting });
  } catch (error) {
    res.status(500).json({ message: "Error creating meeting", error });
  }
};

export const getMeetings = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { courseId } = req.params;
  
  try {
    const meetings = await Meeting.scan("courseId").eq(courseId).exec();
    res.json({ message: "Meetings retrieved successfully", data: meetings });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving meetings", error });
  }
};

export const getMeeting = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { meetingId } = req.params;
  
  try {
    const meeting = await Meeting.get(meetingId);
    if (!meeting) {
      res.status(404).json({ message: "Meeting not found" });
      return;
    }
    
    res.json({ message: "Meeting retrieved successfully", data: meeting });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving meeting", error });
  }
};

export const updateMeeting = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = getAuth(req);
  const { meetingId } = req.params;
  const updateData = req.body;
  
  try {
    const meeting = await Meeting.get(meetingId);
    if (!meeting) {
      res.status(404).json({ message: "Meeting not found" });
      return;
    }
    
    if (meeting.teacherId !== userId) {
      res.status(403).json({ message: "Not authorized to update this meeting" });
      return;
    }
    
    Object.assign(meeting, updateData);
    await meeting.save();
    
    res.json({ message: "Meeting updated successfully", data: meeting });
  } catch (error) {
    res.status(500).json({ message: "Error updating meeting", error });
  }
};

export const deleteMeeting = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = getAuth(req);
  const { meetingId } = req.params;
  
  try {
    const meeting = await Meeting.get(meetingId);
    if (!meeting) {
      res.status(404).json({ message: "Meeting not found" });
      return;
    }
    
    if (meeting.teacherId !== userId) {
      res.status(403).json({ message: "Not authorized to delete this meeting" });
      return;
    }
    
    await Meeting.delete(meetingId);
    
    res.json({ message: "Meeting deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting meeting", error });
  }
};

export const joinMeeting = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = getAuth(req);
  const { meetingId } = req.params;
  
  try {
    const meeting = await Meeting.get(meetingId);
    if (!meeting) {
      res.status(404).json({ message: "Meeting not found" });
      return;
    }
    
    // Проверка, является ли пользователь участником курса
    const course = await Course.get(meeting.courseId);
    const isEnrolled = course.enrollments && course.enrollments.some((e: any) => e.userId === userId);
    const isTeacher = course.teacherId === userId;
    
    if (!isEnrolled && !isTeacher) {
      res.status(403).json({ message: "Not authorized to join this meeting" });
      return;
    }
    
    // Добавление участника или обновление информации
    const participantIndex = meeting.participants.findIndex(
      (p: any) => p.userId === userId
    );
    
    if (participantIndex === -1) {
      meeting.participants.push({
        userId,
        joinedAt: new Date().toISOString(),
      });
    } else {
      meeting.participants[participantIndex].joinedAt = new Date().toISOString();
      meeting.participants[participantIndex].leftAt = null;
    }
    
    await meeting.save();
    
    res.json({ message: "Joined meeting successfully", data: { meetUrl: meeting.meetUrl } });
  } catch (error) {
    res.status(500).json({ message: "Error joining meeting", error });
  }
};
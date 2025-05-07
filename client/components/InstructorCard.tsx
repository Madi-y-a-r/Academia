"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import Link from "next/link";

interface InstructorCardProps {
  teacherId: string;
  teacherName: string;
  teacherTitle?: string;
  teacherBio?: string;
  teacherImage?: string;
}

const InstructorCard = ({
  teacherId,
  teacherName,
  teacherTitle,
  teacherBio,
  teacherImage
}: InstructorCardProps) => {
  return (
    <Card className="course__instructor-card">
      <CardContent className="course__instructor-info pt-6">
        <div className="course__instructor-header">
          <Avatar className="course__instructor-avatar w-12 h-12">
            <AvatarImage src={teacherImage} alt={teacherName} />
            <AvatarFallback className="course__instructor-avatar-fallback bg-primary text-primary-foreground">
              {teacherName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="course__instructor-details">
            <h4 className=" text-lg font-medium text-white-100">
              {teacherName}
            </h4>
            <p className="course__instructor-title text-sm text-gray-100">
              {teacherTitle}
            </p>
          </div>
        </div>
        <div className="course__instructor-bio ">
          <p className="text-sm text-gray-300 dark:text-gray-300 line-clamp-4">
            {teacherBio}
          </p>
        </div>
        {/* <div className="mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full flex items-center gap-2" 
            asChild
          >
            <Link href={`/teacher/${teacherId}/profile`}>
              <User size={16} />
              <span>Профиль преподавателя</span>
            </Link>
          </Button>
        </div> */}
      </CardContent>
    </Card>
  );
};

export default InstructorCard;
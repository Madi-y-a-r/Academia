import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

const TeacherCourseCard = ({
  course,
  onEdit,
  onDelete,
  isOwner,
}: TeacherCourseCardProps) => {
  const t = useTranslations("TeacherCoursesPage.CourseCard")
  return (
    <Card className="course-card-teacher group">
      <CardHeader className="course-card-teacher__header">
        <Image
          src={course.image || "/placeholder.png"}
          alt={course.title}
          width={370}
          height={150}
          className="course-card-teacher__image"
          priority
        />
      </CardHeader>

      <CardContent className="course-card-teacher__content">
        <div className="flex flex-col">
          <CardTitle className="course-card-teacher__title">
            {course.title}
          </CardTitle>

          <CardDescription className="course-card-teacher__category">
            {course.category}
          </CardDescription>

          <p className="text-sm mb-2">
            Status:{" "}
            <span
              className={cn(
                "font-semibold px-2 py-1 rounded",
                course.status === "Published"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              )}
            >
              {course.status}
            </span>
          </p>
          {course.enrollments && (
            <p className="ml-1 mt-1 inline-block text-secondary bg-secondary/10 text-sm font-normal">
              <span className="font-bold text-white-100">
                {course.enrollments.length}
              </span>{" "}
              {t("Students Enrolled")}
            </p>
          )}
        </div>

        <div className="w-full xl:flex space-y-2 xl:space-y-0 gap-2 mt-3">
          {isOwner ? (
            <>
              <div>
                <Button
                  className="rounded w-full bg-primary-700 border-none hover:bg-primary-600 hover:text-customgreys-primarybg text-white-100 cursor-pointer"
                  onClick={() => onEdit(course)}
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  {t("Edit")}
                </Button>
              </div>
              <div>
                <Button
                  className="rounded w-full bg-red-600 text-white-100 hover:bg-red-400 hover:text-customgreys-primarybg cursor-pointer"
                  onClick={() => onDelete(course)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t("Delete")}
                </Button>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500 italic">{t("View Only")}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeacherCourseCard;
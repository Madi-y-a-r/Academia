import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import AccordionSections from "./AccordionSections";
import StarRating from "./StarRating";
import CourseReviews from "./CourseReviews";
import { useTranslations } from "next-intl";

const CoursePreview = ({ course }: CoursePreviewProps) => {
  const t = useTranslations("Course")
  const price = formatPrice(course.price);
  return (
    <div className="course-preview">
      <div className="course-preview__container">
        <div className="course-preview__image-wrapper">
          <Image
            src={course.image || "/placeholder.png"}
            alt="Course Preview"
            width={640}
            height={360}
            className="w-full"
          />
        </div>
        <div>
          <h2 className="course-preview__title">{course.title}</h2>
          <p className="text-gray-400 text-md mb-2">{t("By")} {course.teacherName}</p>
          
          {/* Rating */}
          {course.averageRating !== undefined && course.ratingCount !== undefined && (
            <div className="flex items-center gap-2 mb-4">
              <StarRating 
                rating={course.averageRating} 
                readonly 
                size="medium" 
              />
              <span className="text-sm text-gray-400">
                {course.averageRating.toFixed(1)} ({course.ratingCount} {course.ratingCount === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}
          
          <p className="text-sm text-customgreys-dirtyGrey">
            {course.description}
          </p>
        </div>

        <div>
          <h4 className="text-white-50/90 font-semibold mb-2">
            {t("Course Content")}
          </h4>
          <AccordionSections sections={course.sections} />
        </div>
      </div>

      <div className="course-preview__container">
        <h3 className="text-xl mb-4">{t("Price Details")}</h3>
        <div className="flex justify-between mb-4 text-customgreys-dirtyGrey text-base">
          <span className="font-bold">1x {course.title}</span>
          <br />
          <span className="font-bold">{price}</span>
        </div>
        <div className="flex justify-between border-t border-customgreys-dirtyGrey pt-4">
          <span className="font-bold text-lg">{t("Total Amount")}</span>
          <br />
          <span className="font-bold text-lg">{price}</span>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="course-preview__container">
        <CourseReviews courseId={course.courseId} />
      </div>
    </div>
  );
};

export default CoursePreview;
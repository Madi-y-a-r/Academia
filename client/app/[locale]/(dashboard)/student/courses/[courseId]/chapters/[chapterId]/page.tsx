"use client";

import { useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import ReactPlayer from "react-player";
import Loading from "@/components/Loading";
import { useCourseProgressData } from "@/hooks/useCourseProgressData";
import { useTranslation } from "react-i18next";
import InstructorCard from "@/components/InstructorCard";
import CourseReviews from "@/components/CourseReviews";

const Course = () => {
  const {
    user,
    course,
    userProgress,
    currentSection,
    currentChapter,
    isLoading,
    isChapterCompleted,
    updateChapterProgress,
    hasMarkedComplete,
    setHasMarkedComplete,
  } = useCourseProgressData();
  const [activeTab, setActiveTab] = useState("Notes"); 
  const { t } = useTranslation();

  const playerRef = useRef<ReactPlayer>(null);

  const handleProgress = ({ played }: { played: number }) => {
    if (
      played >= 0.8 &&
      !hasMarkedComplete &&
      currentChapter &&
      currentSection &&
      userProgress?.sections &&
      !isChapterCompleted()
    ) {
      setHasMarkedComplete(true);
      updateChapterProgress(
        currentSection.sectionId,
        currentChapter.chapterId,
        true
      );
    }
  };
  if (isLoading) return <Loading />;
  if (!user) return <div>Please sign in to view this course.</div>;
  if (!course || !userProgress) return <div>Error loading course</div>;
  return (
    <div className="course">
      <div className="course__container">
        <div className="course__breadcrumb">
          <div className="course__path">
            {course.title} / {currentSection?.sectionTitle} /{" "}
            <span className="course__current-chapter">
              {currentChapter?.title}
            </span>
          </div>
          <h2 className="course__title">{currentChapter?.title}</h2>
          <div className="course__header">
            <div className="course__instructor">
              <Avatar className="course__avatar">
                <AvatarImage alt={course.teacherName} />
                <AvatarFallback className="course__avatar-fallback">
                  {course.teacherName[0]}
                </AvatarFallback>
              </Avatar>
              <span className="course__instructor-name">
                {course.teacherName}
              </span>
            </div>
          </div>
        </div>

        <Card className="course__video">
          <CardContent className="course__video-container">
            {currentChapter?.video ? (
              <ReactPlayer
                ref={playerRef}
                url={currentChapter.video as string}
                controls
                width="100%"
                height="100%"
                onProgress={handleProgress}
                config={{
                  file: {
                    attributes: {
                      controlsList: "nodownload",
                    },
                  },
                }}
              />
            ) : (
              <div className="course__no-video">
                No video available for this chapter.
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4 mt-12">
          <Tabs 
            onValueChange={setActiveTab}
            value={activeTab} 
            defaultValue="Notes" 
            className="w-full md:w-2/3"
          >
            <TabsList className="course__tabs-list">
              <TabsTrigger className="course__tab" value="Notes">
                Notes
              </TabsTrigger>
              <TabsTrigger className="course__tab" value="Resources">
                Resources
              </TabsTrigger>
              <TabsTrigger className="course__tab" value="Reviews">
                Reviews
              </TabsTrigger>
              {/* <TabsTrigger className="course__tab" value="Quiz">
                Quiz
              </TabsTrigger> */}
            </TabsList>

            <TabsContent className="course__tab-content" value="Notes">
              <Card className="course__tab-card">
                <CardHeader className="course__tab-header">
                  <CardTitle>Notes Content</CardTitle>
                </CardHeader>
                <CardContent className="course__tab-body">
                  {currentChapter?.teacherNotes}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent className="course__tab-content" value="Resources">
              <Card className="course__tab-card">
                <CardHeader className="course__tab-header">
                  <CardTitle>Resources Content</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  {currentChapter?.resources?.map((resource) => (
                    <div key={resource.title} className="p-4 border rounded-lg transition-colors">
                      <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
                      {resource.description && (
                        <p className="text-gray-600 mb-3">{resource.description}</p>
                      )}
                      <a 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 break-all"
                      >
                        {resource.url}
                      </a>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent className="course__tab-content" value="Reviews">
              <CourseReviews 
                courseId={course.courseId} 
                isEnrolled={true}
                isTeacher={course.teacherId === user?.id}
              />
            </TabsContent>

            {/* <TabsContent className="course__tab-content" value="Quiz">
              <Card className="course__tab-card">
                <CardHeader className="course__tab-header">
                  <CardTitle>Quiz Content</CardTitle>
                </CardHeader>
                <CardContent className="course__tab-body">
                  // Add quiz content here 
                </CardContent>
              </Card>
            </TabsContent> */}
          </Tabs>

          <InstructorCard 
            teacherId={course.teacherId}
            teacherName={course.teacherName}
            teacherTitle={course.teacherTitle}
            teacherBio={course.teacherBio}
          />
        </div>
      </div>
    </div>
  );
};

export default Course;
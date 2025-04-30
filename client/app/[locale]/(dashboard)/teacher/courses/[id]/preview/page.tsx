"use client";

import { useRef, useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import ReactPlayer from "react-player";
import Loading from "@/components/Loading";
import { useGetCourseQuery } from "@/state/api";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useAppSelector } from "@/state/redux";
import ChaptersSidebar from "./ChaptersSidebar";
import { useTranslations } from "next-intl";

const CoursePreview = () => {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  const t = useTranslations("TeacherCoursesPage.Preview");
  
  const { data: course, isLoading } = useGetCourseQuery(courseId);
  const [activeTab, setActiveTab] = useState("Notes");
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);

  const playerRef = useRef<ReactPlayer>(null);

  useEffect(() => {
    // Reset to first chapter when course data loads
    if (course && course.sections && course.sections.length > 0) {
      setCurrentSectionIndex(0);
      setCurrentChapterIndex(0);
    }
  }, [course]);

  const handleChapterChange = (sectionIndex: number, chapterIndex: number) => {
    setCurrentSectionIndex(sectionIndex);
    setCurrentChapterIndex(chapterIndex);
  };

  if (isLoading) return <Loading />;
  if (!course) return <div className="p-4">Error loading course</div>;

  const currentSection = course.sections[currentSectionIndex];
  const currentChapter = currentSection?.chapters[currentChapterIndex];

  return (
    <div className="flex">
      <div className="w-64 h-screen overflow-auto border-r border-customgreys-darkGrey">
        <ChaptersSidebar 
          course={course} 
          currentChapterId={currentChapter?.chapterId} 
          onChapterSelect={handleChapterChange} 
        />
      </div>

      <div className="flex-1 p-4">
        <div className="flex items-center gap-5 mb-5">
          <button
            className="flex items-center border border-customgreys-dirtyGrey rounded-lg p-2 gap-2 cursor-pointer hover:bg-customgreys-dirtyGrey hover:text-white-100 text-customgreys-dirtyGrey"
            onClick={() => router.push(`/teacher/courses/${courseId}`, { scroll: false })}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t("Back to Course Editor")}</span>
          </button>
          <div className="text-xl font-semibold text-primary-700">{t("Student Preview Mode")}</div>
        </div>

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
                    {t("No video available for this chapter.")}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="course__content">
              <Tabs 
                onValueChange={setActiveTab}
                value={activeTab} 
                defaultValue="Notes" 
                className="course__tabs"
              >
                <TabsList className="course__tabs-list">
                  <TabsTrigger className="course__tab" value="Notes">
                    {t("Notes")}
                  </TabsTrigger>
                  <TabsTrigger className="course__tab" value="Resources">
                    {t("Resources")}
                  </TabsTrigger>
                  <TabsTrigger className="course__tab" value="Quiz">
                    {t("Quiz")}
                  </TabsTrigger>
                </TabsList>

                <TabsContent className="course__tab-content" value="Notes">
                  <Card className="course__tab-card">
                    <CardHeader className="course__tab-header">
                      <CardTitle>{t("Notes Content")}</CardTitle>
                    </CardHeader>
                    <CardContent className="course__tab-body">
                      {currentChapter?.teacherNotes || t("No notes available for this chapter.")}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent className="course__tab-content" value="Resources">
                  <Card className="course__tab-card">
                    <CardHeader className="course__tab-header">
                      <CardTitle>{t("Resources Content")}</CardTitle>
                    </CardHeader>
                    <CardContent className="course__tab-body">
                      {currentChapter?.resources && currentChapter.resources.length > 0 ? (
                        currentChapter.resources.map((resource) => (
                          <div key={resource.title} className="mb-4">
                            <h3 className="text-lg font-medium">{resource.title}</h3>
                            <p className="text-sm text-gray-600 my-1">{resource.description}</p>
                            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-primary-700 underline">
                              {resource.url}
                            </a>
                          </div>
                        ))
                      ) : (
                        <div>{t("No resources available for this chapter")}</div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent className="course__tab-content" value="Quiz">
                  <Card className="course__tab-card">
                    <CardHeader className="course__tab-header">
                      <CardTitle>{t("Quiz Content")}</CardTitle>
                    </CardHeader>
                    <CardContent className="course__tab-body">
                      {t("Quiz content will be displayed here")}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <Card className="course__instructor-card">
                <CardContent className="course__instructor-info">
                  <div className="course__instructor-header">
                    <Avatar className="course__instructor-avatar">
                      <AvatarImage alt={course.teacherName} />
                      <AvatarFallback className="course__instructor-avatar-fallback">
                        {course.teacherName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="course__instructor-details">
                      <h4 className="course__instructor-name">
                        {course.teacherName}
                      </h4>
                      <p className="course__instructor-title">{t("Senior UX Designer")}</p>
                    </div>
                  </div>
                  <div className="course__instructor-bio">
                    <p>
                      {t("A seasoned Senior UX Designer with over 15 years of experience in creating intuitive and engaging digital experiences. Expertise in leading UX design projects.")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePreview;
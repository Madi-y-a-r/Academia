import { useState, useRef } from "react";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  CheckCircle,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface ChaptersSidebarProps {
  course: any;
  currentChapterId: string;
  onChapterSelect: (sectionIndex: number, chapterIndex: number) => void;
}

const ChaptersSidebar = ({ 
  course, 
  currentChapterId,
  onChapterSelect 
}: ChaptersSidebarProps) => {
  const t = useTranslations("TeacherCoursesPage.Preview");
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections((prevSections) =>
      prevSections.includes(sectionTitle)
        ? prevSections.filter((title) => title !== sectionTitle)
        : [...prevSections, sectionTitle]
    );
  };

  const handleChapterClick = (sectionIndex: number, chapterIndex: number) => {
    onChapterSelect(sectionIndex, chapterIndex);
  };

  return (
    <div ref={sidebarRef} className="chapters-sidebar">
      <div className="chapters-sidebar__header p-4">
        <h2 className="chapters-sidebar__title text-lg font-bold">{course.title}</h2>
        <hr className="chapters-sidebar__divider my-2" />
      </div>
      {course.sections.map((section: any, sectionIndex: number) => (
        <Section
          key={section.sectionId}
          section={section}
          sectionIndex={sectionIndex}
          currentChapterId={currentChapterId}
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          handleChapterClick={handleChapterClick}
        />
      ))}
    </div>
  );
};

const Section = ({
  section,
  sectionIndex,
  currentChapterId,
  expandedSections,
  toggleSection,
  handleChapterClick,
}: {
  section: any;
  sectionIndex: number;
  currentChapterId: string;
  expandedSections: string[];
  toggleSection: (sectionTitle: string) => void;
  handleChapterClick: (sectionIndex: number, chapterIndex: number) => void;
}) => {
  const t = useTranslations("TeacherCoursesPage.Preview");
  const isExpanded = expandedSections.includes(section.sectionTitle);
  
  // Automatically expand the section containing the current chapter
  const hasCurrentChapter = section.chapters.some(
    (chapter: any) => chapter.chapterId === currentChapterId
  );
  
  if (hasCurrentChapter && !isExpanded) {
    toggleSection(section.sectionTitle);
  }

  const completedChapters = 0; // In preview mode, nothing is completed
  const totalChapters = section.chapters.length;

  return (
    <div className="chapters-sidebar__section">
      <div
        onClick={() => toggleSection(section.sectionTitle)}
        className="chapters-sidebar__section-header p-3 cursor-pointer hover:bg-customgreys-darkGrey"
      >
        <div className="chapters-sidebar__section-title-wrapper flex items-center">
          <p className="chapters-sidebar__section-number text-sm text-gray-500">
            {t("Section")} 0{sectionIndex + 1}
          </p>
          {isExpanded ? (
            <ChevronUp className="chapters-sidebar__chevron ml-2 h-4 w-4" />
          ) : (
            <ChevronDown className="chapters-sidebar__chevron ml-2 h-4 w-4" />
          )}
        </div>
        <h3 className="chapters-sidebar__section-title text-base font-medium mt-1">
          {section.sectionTitle}
        </h3>
      </div>
      <hr className="chapters-sidebar__divider" />

      {isExpanded && (
        <div className="chapters-sidebar__section-content p-3">
          <ProgressVisuals
            section={section}
            completedChapters={completedChapters}
            totalChapters={totalChapters}
          />
          <ChaptersList
            section={section}
            sectionIndex={sectionIndex}
            currentChapterId={currentChapterId}
            handleChapterClick={handleChapterClick}
          />
        </div>
      )}
      <hr className="chapters-sidebar__divider" />
    </div>
  );
};

const ProgressVisuals = ({
  section,
  completedChapters,
  totalChapters,
}: {
  section: any;
  completedChapters: number;
  totalChapters: number;
}) => {
  const t = useTranslations("TeacherCoursesPage.Preview");
  return (
    <>
      <div className="chapters-sidebar__progress mb-2">
        <div className="chapters-sidebar__progress-bars flex-1 flex space-x-1">
          {section.chapters.map((chapter: any) => {
            const isCompleted = false; // In preview mode, nothing is completed
            return (
              <div
                key={chapter.chapterId}
                className={cn(
                  "chapters-sidebar__progress-bar h-1 flex-1 bg-gray-300 rounded",
                  isCompleted && "chapters-sidebar__progress-bar--completed bg-green-500"
                )}
              ></div>
            );
          })}
        </div>
        <div className="chapters-sidebar__trophy ml-2">
          <Trophy className="chapters-sidebar__trophy-icon h-4 w-4 text-gray-400" />
        </div>
      </div>
      <p className="chapters-sidebar__progress-text text-xs text-gray-500 mb-2">
        {completedChapters}/{totalChapters} {t("COMPLETED")}
      </p>
    </>
  );
};

const ChaptersList = ({
  section,
  sectionIndex,
  currentChapterId,
  handleChapterClick,
}: {
  section: any;
  sectionIndex: number;
  currentChapterId: string;
  handleChapterClick: (sectionIndex: number, chapterIndex: number) => void;
}) => {
  return (
    <ul className="chapters-sidebar__chapters space-y-2">
      {section.chapters.map((chapter: any, chapterIndex: number) => (
        <Chapter
          key={chapter.chapterId}
          chapter={chapter}
          index={chapterIndex}
          sectionIndex={sectionIndex}
          currentChapterId={currentChapterId}
          handleChapterClick={handleChapterClick}
        />
      ))}
    </ul>
  );
};

const Chapter = ({
  chapter,
  index,
  sectionIndex,
  currentChapterId,
  handleChapterClick,
}: {
  chapter: any;
  index: number;
  sectionIndex: number;
  currentChapterId: string;
  handleChapterClick: (sectionIndex: number, chapterIndex: number) => void;
}) => {
  const isCompleted = false; // In preview mode, nothing is completed
  const isCurrentChapter = currentChapterId === chapter.chapterId;

  return (
    <li
      className={cn("chapters-sidebar__chapter flex items-center p-2 rounded cursor-pointer hover:bg-customgreys-darkGrey", {
        "chapters-sidebar__chapter--current bg-customgreys-darkGrey": isCurrentChapter,
      })}
      onClick={() => handleChapterClick(sectionIndex, index)}
    >
      {isCompleted ? (
        <div
          className="chapters-sidebar__chapter-check mr-2"
          title="Toggle completion status"
        >
          <CheckCircle className="chapters-sidebar__check-icon h-5 w-5 text-green-500" />
        </div>
      ) : (
        <div
          className={cn("chapters-sidebar__chapter-number mr-2 h-5 w-5 rounded-full flex items-center justify-center text-xs", {
            "chapters-sidebar__chapter-number--current bg-primary-700 text-white": isCurrentChapter,
            "bg-gray-200 text-gray-700": !isCurrentChapter,
          })}
        >
          {index + 1}
        </div>
      )}
      <span
        className={cn("chapters-sidebar__chapter-title text-sm", {
          "chapters-sidebar__chapter-title--completed text-green-500": isCompleted,
          "chapters-sidebar__chapter-title--current font-medium": isCurrentChapter,
        })}
      >
        {chapter.title}
      </span>
      {chapter.type === "Text" && (
        <FileText className="chapters-sidebar__text-icon ml-auto h-4 w-4 text-gray-500" />
      )}
    </li>
  );
};

export default ChaptersSidebar;
export type Roles = "teacher" | "student"

declare global {
  
  interface PaymentMethod {
    methodId: string;
    type: string;
    lastFour: string;
    expiry: string;
  }

  interface UserSettings {
    theme?: "light" | "dark";
    emailAlerts?: boolean;
    smsAlerts?: boolean;
    courseNotifications?: boolean;
    notificationFrequency?: "immediate" | "daily" | "weekly";
  }
  
  interface User {
    userId: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    email: string;
    publicMetadata: {
      userType: Roles;
    };
    privateMetadata: {
      settings?: UserSettings;
      paymentMethods?: Array<PaymentMethod>;
      defaultPaymentMethodId?: string;
      stripeCustomerId?: string;
    };
    unsafeMetadata: {
      bio?: string;
      urls?: string[];
    };
  }

  interface Course {
    courseId: string;
    teacherId: string;
    teacherName: string;
    teacherTitle?: string;
    teacherBio?: string;
    title: string;
    description?: string;
    category: string;
    image?: string;
    price?: number; // Stored in cents (e.g., 4999 for $49.99)
    level: "Beginner" | "Intermediate" | "Advanced";
    status: "Draft" | "Published";
    sections: Section[];
    enrollments?: Array<{
      userId: string;
    }>;
    averageRating?: number;
    ratingCount?: number;
    ratingDistribution?: number[]; // [count1star, count2star, count3star, count4star, count5star]
  }

  interface Transaction {
    userId: string;
    transactionId: string;
    dateTime: string;
    courseId: string;
    paymentProvider: "stripe";
    paymentMethodId?: string;
    amount: number; // Stored in cents
    savePaymentMethod?: boolean;
  }

  interface DateRange {
    from: string | undefined;
    to: string | undefined;
  }

  interface UserCourseProgress {
    userId: string;
    courseId: string;
    enrollmentDate: string;
    overallProgress: number;
    sections: SectionProgress[];
    lastAccessedTimestamp: string;
  }

  type CreateUserArgs = Omit<User, "userId">;
  type CreateCourseArgs = Omit<Course, "courseId">;
  type CreateTransactionArgs = Omit<Transaction, "transactionId">;

  interface CourseCardProps {
    course: Course;
    onGoToCourse: (course: Course) => void;
  }

  interface TeacherCourseCardProps {
    course: Course;
    onEdit: (course: Course) => void;
    onDelete: (course: Course) => void;
    isOwner: boolean;
  }

  interface Comment {
    commentId: string;
    userId: string;
    text: string;
    timestamp: string;
  }

  interface Quiz {
    quizId: string;
    title: string;
    description?: string;
    questions: Array<{
      questionId: string;
      questionText: string;
      options: Array<{
        optionId: string;
        text: string;
        isCorrect: boolean;
      }>;
      explanation?: string;
    }>;
    passingScore: number;
  }

  interface Chapter {
    chapterId: string;
    title: string;
    content: string;
    video?: string | File;
    freePreview?: boolean;
    type: "Text" | "Video";
    // quizzes?: Quiz[]; 
    teacherNotes?: string;
    resources?: {
      title: string;
      url: string;
      description?: string;
    }[];
  }

  interface ChapterProgress {
    chapterId: string;
    completed: boolean;
  }

  interface SectionProgress {
    sectionId: string;
    chapters: ChapterProgress[];
  }

  interface Section {
    sectionId: string;
    sectionTitle: string;
    sectionDescription?: string;
    chapters: Chapter[];
  }

  interface WizardStepperProps {
    currentStep: number;
  }

  interface AccordionSectionsProps {
    sections: Section[];
  }

  interface SearchCourseCardProps {
    course: Course;
    isSelected?: boolean;
    onClick?: () => void;
  }

  interface CoursePreviewProps {
    course: Course;
  }

  interface CustomFixedModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
  }

  interface HeaderProps {
    title: string;
    subtitle: string;
    rightElement?: ReactNode;
  }

  interface SharedNotificationSettingsProps {
    title?: string;
    subtitle?: string;
  }

  interface SelectedCourseProps {
    course: Course;
    handleEnrollNow: (courseId: string) => void;
  }

  interface ToolbarProps {
    onSearch: (search: string) => void;
    onCategoryChange: (category: string) => void;
  }

  interface QuizModalProps {
    isOpen: boolean;
    onClose: () => void;
    sectionIndex: number | null;
    chapterIndex: number | null;
    quizIndex: number | null;
    sections: Section[];
    setSections: React.Dispatch<React.SetStateAction<Section[]>>;
    courseId: string;
  }

  interface ChapterModalProps {
    isOpen: boolean;
    onClose: () => void;
    sectionIndex: number | null;
    chapterIndex: number | null;
    sections: Section[];
    setSections: React.Dispatch<React.SetStateAction<Section[]>>;
    courseId: string;
  }

  interface SectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    sectionIndex: number | null;
    sections: Section[];
    setSections: React.Dispatch<React.SetStateAction<Section[]>>;
  }

  interface DroppableComponentProps {
    sections: Section[];
    setSections: (sections: Section[]) => void;
    handleEditSection: (index: number) => void;
    handleDeleteSection: (index: number) => void;
    handleAddChapter: (sectionIndex: number) => void;
    handleEditChapter: (sectionIndex: number, chapterIndex: number) => void;
    handleDeleteChapter: (sectionIndex: number, chapterIndex: number) => void;
  }

  interface CourseFormData {
    courseTitle: string;
    courseDescription: string;
    courseCategory: string;
    coursePrice: string;
    courseStatus: boolean;
  }

  interface Meeting {
    meetingId: string;
    courseId: string;
    teacherId: string;
    title: string;
    description?: string;
    startTime: string;
    endTime: string;
    meetUrl: string;
    participants?: Array<{
      userId: string;
      email: string;
    }>;
  }

  interface Rating {
    ratingId: string;
    courseId: string;
    userId: string;
    userName: string;
    rating: number; // 1-5 stars
    comment?: string;
    helpfulCount: number;
    helpfulVotes: string[]; // array of userIds
    createdAt: string;
    updatedAt: string;
  }

  interface RatingStats {
    averageRating: number;
    ratingCount: number;
    ratingDistribution: number[]; // [count1star, count2star, count3star, count4star, count5star]
  }

  interface CourseRatingsResponse {
    message: string;
    data: {
      ratings: Rating[];
      totalCount: number;
      currentPage: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }

  interface RatingStatsResponse {
    message: string;
    data: RatingStats;
  }

  interface UserRatingResponse {
    message: string;
    data: Rating | null;
  }

  interface StarRatingProps {
    rating: number;
    onRatingChange?: (rating: number) => void;
    size?: "small" | "medium" | "large";
    readonly?: boolean;
  }

  interface RatingStatsProps {
    stats: RatingStats;
    showDistribution?: boolean;
  }

  interface RatingFormProps {
    courseId: string;
    existingRating?: Rating;
    onSubmit: (rating: number, comment: string) => void;
    onCancel: () => void;
    isLoading?: boolean;
  }

  interface RatingListProps {
    ratings: Rating[];
    onMarkHelpful: (ratingId: string) => void;
    currentUserId?: string;
    isLoading?: boolean;
  }

  interface CourseReviewsProps {
    courseId: string;
    isEnrolled?: boolean;
    isTeacher?: boolean;
  }
}

export {};
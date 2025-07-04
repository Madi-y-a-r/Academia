import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BaseQueryApi, FetchArgs } from "@reduxjs/toolkit/query";
import { User } from "@clerk/nextjs/server";
import { Clerk } from "@clerk/clerk-js";
import { toast } from "sonner";

const customBaseQuery = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: any
) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers) => {
      const token = await window.Clerk?.session?.getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });

  try {
    const result: any = await baseQuery(args, api, extraOptions);

    if (result.error) {
      const errorData = result.error.data;
      const errorMessage =
        errorData?.message ||
        result.error.status.toString() ||
        "An error occurred";
      toast.error(`Error: ${errorMessage}`);
    }

    const isMutationRequest =
      (args as FetchArgs).method && (args as FetchArgs).method !== "GET";

    if (isMutationRequest) {
      const successMessage = result.data?.message;
      if (successMessage) toast.success(successMessage);
    }

    if (result.data) {
      result.data = result.data.data;
    } else if (
      result.error?.status === 204 ||
      result.meta?.response?.status === 24
    ) {
      return { data: null };
    }

    return result;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return { error: { status: "FETCH_ERROR", error: errorMessage } };
  }
};

export const api = createApi({
  baseQuery: customBaseQuery,
  reducerPath: "api",
  tagTypes: ["Courses", "Users", "UserCourseProgress", "Meetings", "Ratings", "Rating"],
  endpoints: (build) => ({
    /* 
    ===============
    USER CLERK
    =============== 
    */
    getUser: build.query<User, string>({
      query: (userId) => `users/clerk/${userId}`,
      providesTags: (result, error, id) => [{ type: "Users", id }],
    }),
    updateUser: build.mutation<User, Partial<User> & { userId: string }>({
      query: ({ userId, ...updatedUser }) => ({
        url: `users/clerk/${userId}`,
        method: "PUT",
        body: updatedUser,
      }),
      invalidatesTags: ["Users"],
    }),

    /* 
    ===============
    COURSES
    =============== 
    */
    getCourses: build.query<Course[], { category?: string }>({
      query: ({ category }) => ({
        url: "courses",
        params: { category },
      }),
      providesTags: ["Courses"],
    }),
    getPublishedCourses: build.query<Course[], { category?: string }>({
      query: ({ category }) => ({
        url: "courses",
        params: { 
          category,
          status: "Published"
        },
      }),
      providesTags: ["Courses"],
    }),
    getTeacherCourses: build.query<Course[], { category?: string, teacherId?: string }>({
      query: ({ category, teacherId }) => ({
        url: "courses",
        params: { 
          category,
          teacherId,
        },
      }),
      providesTags: ["Courses"],
    }),

    getCourse: build.query<Course, string>({
      query: (id) => `courses/${id}`,
      providesTags: (result, error, id) => [{ type: "Courses", id }],
    }),

    createCourse: build.mutation<
      Course,
      { teacherId: string; teacherName: string }
    >({
      query: (body) => ({
        url: `courses`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Courses"],
    }),
    updateCourse: build.mutation<
      Course,
      { courseId: string; formData: FormData }
    >({
      query: ({ courseId, formData }) => ({
        url: `courses/${courseId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { courseId }) => [
        { type: "Courses", id: courseId },
      ],
    }),

    deleteCourse: build.mutation<{ message: string }, string>({
      query: (courseId) => ({
        url: `courses/${courseId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Courses"],
    }),

    getUploadVideoUrl: build.mutation<
      { uploadUrl: string; videoUrl: string },
      {
        courseId: string;
        chapterId: string;
        sectionId: string;
        fileName: string;
        fileType: string;
      }
    >({
      query: ({ courseId, sectionId, chapterId, fileName, fileType }) => ({
        url: `courses/${courseId}/sections/${sectionId}/chapters/${chapterId}/get-upload-url`,
        method: "POST",
        body: { fileName, fileType },
      }),
    }),
    /* 
    ===============
    MEETINGS
    =============== 
    */
    createMeeting: build.mutation<Meeting, {
      courseId: string;
      title: string;
      description: string;
      scheduledStartTime: string;
      scheduledEndTime: string;
      meetUrl: string;
    }
    >({
    query: (meetingData) => ({
      url: `meetings`,
      method: "POST",
      body: meetingData,
    }),
    }),

    getCourseMeetings: build.query<Meeting[], string>({
      query: (courseId) => `meetings/course/${courseId}`,
      providesTags: ["Meetings"],
    }),

    getMeeting: build.query<Meeting, string>({
    query: (meetingId) => `meetings/${meetingId}`,
    providesTags: (result, error, id) => [{ type: "Meetings", id }],
    }),

    updateMeeting: build.mutation<
      Meeting,
      {
        meetingId: string;
        updateData: Partial<Meeting>;
      }
    >({
    query: ({ meetingId, updateData }) => ({
      url: `meetings/${meetingId}`,
      method: "PUT",
      body: updateData,
    }),
    invalidatesTags: (result, error, { meetingId }) => [
      { type: "Meetings", id: meetingId },
    ],
    }),

    deleteMeeting: build.mutation<{ message: string }, string>({
    query: (meetingId) => ({
      url: `meetings/${meetingId}`,
      method: "DELETE",
    }),
    invalidatesTags: ["Meetings"],
    }),

    joinMeeting: build.mutation<{ meetUrl: string }, string>({
    query: (meetingId) => ({
      url: `meetings/${meetingId}/join`,
      method: "POST",
    }),
    }),

    /* 
    ===============
    TRANSACTIONS
    =============== 
    */
    getTransactions: build.query<Transaction[], string>({
      query: (userId) => `transactions?userId=${userId}`,
    }),
    createStripePaymentIntent: build.mutation<
      { clientSecret: string },
      { amount: number }
    >({
      query: ({ amount }) => ({
        url: `/transactions/stripe/payment-intent`,
        method: "POST",
        body: { amount },
      }),
    }),
    createTransaction: build.mutation<Transaction, Partial<Transaction>>({
      query: (transaction) => ({
        url: "transactions",
        method: "POST",
        body: transaction,
      }),
    }),

    /* 
    ===============
    USER COURSE PROGRESS
    =============== 
    */
    getUserEnrolledCourses: build.query<Course[], string>({
      query: (userId) => `users/course-progress/${userId}/enrolled-courses`,
      providesTags: ["Courses", "UserCourseProgress"],
    }),

    getUserCourseProgress: build.query<
      UserCourseProgress,
      { userId: string; courseId: string }
    >({
      query: ({ userId, courseId }) =>
        `users/course-progress/${userId}/courses/${courseId}`,
      providesTags: ["UserCourseProgress"],
    }),

    updateUserCourseProgress: build.mutation<
      UserCourseProgress,
      {
        userId: string;
        courseId: string;
        progressData: {
          sections: SectionProgress[];
        };
      }
    >({
      query: ({ userId, courseId, progressData }) => ({
        url: `users/course-progress/${userId}/courses/${courseId}`,
        method: "PUT",
        body: progressData,
      }),
      invalidatesTags: ["UserCourseProgress"],
      async onQueryStarted(
        { userId, courseId, progressData },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          api.util.updateQueryData(
            "getUserCourseProgress",
            { userId, courseId },
            (draft) => {
              Object.assign(draft, {
                ...draft,
                sections: progressData.sections,
              });
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    /* 
    ===============
    RATINGS
    =============== 
    */
    getCourseRatings: build.query<
      CourseRatingsResponse,
      { 
        courseId: string; 
        page?: number; 
        limit?: number; 
        sortBy?: "createdAt" | "rating" | "helpful" 
      }
    >({
      query: ({ courseId, page = 1, limit = 10, sortBy = "createdAt" }) => ({
        url: `courses/${courseId}/ratings`,
        params: { page, limit, sortBy },
      }),
      providesTags: (result, error, { courseId }) => [
        { type: "Ratings", id: courseId },
      ],
    }),

    getCourseRatingStats: build.query<RatingStatsResponse, string>({
      query: (courseId) => `courses/${courseId}/ratings/stats`,
      providesTags: (result, error, courseId) => [
        { type: "Ratings", id: `${courseId}-stats` },
      ],
    }),

    getUserRating: build.query<UserRatingResponse, string>({
      query: (courseId) => `courses/${courseId}/ratings/my`,
      providesTags: (result, error, courseId) => [
        { type: "Ratings", id: `user-${courseId}` },
      ],
    }),

    createOrUpdateRating: build.mutation<
      Rating,
      { courseId: string; rating: number; review?: string }
    >({
      query: ({ courseId, rating, review }) => ({
        url: `courses/${courseId}/ratings`,
        method: "POST",
        body: { rating, comment: review },
      }),
      invalidatesTags: (result, error, { courseId }) => [
        { type: "Ratings", id: courseId },
        { type: "Ratings", id: `${courseId}-stats` },
        { type: "Ratings", id: `user-${courseId}` },
        { type: "Courses", id: courseId },
      ],
    }),

    updateRating: build.mutation<
      Rating,
      { courseId: string; rating: number; review?: string }
    >({
      query: ({ courseId, rating, review }) => ({
        url: `ratings/courses/${courseId}`,
        method: "PUT",
        body: { rating, review },
      }),
      invalidatesTags: (result, error, { courseId }) => [
        { type: "Ratings", id: courseId },
        { type: "Ratings", id: `${courseId}-stats` },
        { type: "Ratings", id: `user-${courseId}` },
        { type: "Courses", id: courseId },
      ],
    }),

    deleteRating: build.mutation<{ message: string }, { courseId: string; ratingId: string }>({
      query: ({ courseId, ratingId }) => ({
        url: `courses/${courseId}/ratings/${ratingId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { courseId }) => [
        { type: "Ratings", id: courseId },
        { type: "Ratings", id: `${courseId}-stats` },
        { type: "Ratings", id: `user-${courseId}` },
        { type: "Courses", id: courseId },
      ],
    }),

    markRatingHelpful: build.mutation<
      Rating,
      { courseId: string; ratingId: string }
    >({
      query: ({ ratingId }) => ({
        url: `ratings/${ratingId}/helpful`,
        method: "POST",
      }),
      invalidatesTags: (result, error, { courseId }) => [
        { type: "Ratings", id: courseId },
      ],
    }),

  }),
});

export const {
  useGetUserQuery,
  useUpdateUserMutation,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useGetCoursesQuery,
  useGetPublishedCoursesQuery,
  useGetCourseQuery,
  useGetUploadVideoUrlMutation,
  useGetTransactionsQuery,
  useCreateTransactionMutation,
  useCreateStripePaymentIntentMutation,
  useGetUserEnrolledCoursesQuery,
  useGetUserCourseProgressQuery,
  useUpdateUserCourseProgressMutation,
  useCreateMeetingMutation,
  useGetCourseMeetingsQuery,
  useGetMeetingQuery,
  useUpdateMeetingMutation,
  useDeleteMeetingMutation,
  // Rating hooks
  useGetCourseRatingsQuery,
  useGetCourseRatingStatsQuery,
  useGetUserRatingQuery,
  useCreateOrUpdateRatingMutation,
  useDeleteRatingMutation,
  useMarkRatingHelpfulMutation,
  useJoinMeetingMutation,
  useGetTeacherCoursesQuery,
} = api;

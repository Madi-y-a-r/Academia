"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Star, Edit } from "lucide-react";

import StarRating from "./StarRating";
import RatingStats from "./RatingStats";
import RatingForm from "./RatingForm";
import RatingList from "./RatingList";

import {
  useGetCourseRatingsQuery,
  useGetCourseRatingStatsQuery,
  useGetUserRatingQuery,
  useCreateOrUpdateRatingMutation,
  useDeleteRatingMutation,
  useMarkRatingHelpfulMutation,
} from "@/state/api";

export default function CourseReviews({
  courseId,
  isEnrolled = false,
  isTeacher = false,
}: CourseReviewsProps) {
  const { user } = useUser();
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<"createdAt" | "rating" | "helpful">("createdAt");

  // API queries
  const { data: ratingsData, isLoading: ratingsLoading } = useGetCourseRatingsQuery({
    courseId,
    page,
    limit: 10,
    sortBy,
  });

  const { data: statsData, isLoading: statsLoading } = useGetCourseRatingStatsQuery(courseId);

  const { data: userRatingData } = useGetUserRatingQuery(courseId, {
    skip: !user?.id,
  });

  // API mutations
  const [createOrUpdateRating, { isLoading: submittingRating }] = useCreateOrUpdateRatingMutation();
  const [deleteRating] = useDeleteRatingMutation();
  const [markRatingHelpful] = useMarkRatingHelpfulMutation();

  const ratings = ratingsData?.data?.ratings || [];
  const ratingStats = statsData?.data;
  const userRating = userRatingData?.data;
  const hasUserRating = Boolean(userRating);

  const canRate = user && isEnrolled && !isTeacher;
  const canViewRatings = true; // Все могут просматривать отзывы

  const handleSubmitRating = async (rating: number, comment: string) => {
    try {
      await createOrUpdateRating({
        courseId,
        rating,
        review: comment,
      }).unwrap();
      setShowRatingForm(false);
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  const handleMarkHelpful = async (ratingId: string) => {
    try {
      await markRatingHelpful({ courseId, ratingId }).unwrap();
    } catch (error) {
      console.error("Error marking rating as helpful:", error);
    }
  };

  const handleDeleteRating = async () => {
    if (!userRating) return;
    
    if (confirm("Вы уверены, что хотите удалить свой отзыв?")) {
      try {
        await deleteRating({ courseId, ratingId: userRating.ratingId }).unwrap();
      } catch (error) {
        console.error("Error deleting rating:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Заголовок секции */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <MessageSquare className="w-6 h-6" />
          Отзывы и оценки
        </h2>

        {/* Кнопка добавления отзыва */}
        {canRate && !showRatingForm && (
          <Button
            onClick={() => setShowRatingForm(true)}
            className="flex items-center gap-2"
          >
            {hasUserRating ? (
              <>
                <Edit className="w-4 h-4" />
                Редактировать отзыв
              </>
            ) : (
              <>
                <Star className="w-4 h-4" />
                Оставить отзыв
              </>
            )}
          </Button>
        )}
      </div>

      {/* Форма добавления/редактирования отзыва */}
      {showRatingForm && canRate && (
        <div className="flex justify-center">
          <RatingForm
            courseId={courseId}
            existingRating={userRating || undefined}
            onSubmit={handleSubmitRating}
            onCancel={() => setShowRatingForm(false)}
            isLoading={submittingRating}
          />
        </div>
      )}

      {/* Статистика и список отзывов */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Статистика */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Статистика оценок</CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-20 bg-gray-200 rounded"></div>
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-4 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              ) : ratingStats ? (
                <RatingStats stats={ratingStats} showDistribution />
              ) : (
                <p className="text-gray-500 text-center">Нет данных</p>
              )}
            </CardContent>
          </Card>

          {/* Текущий отзыв пользователя */}
          {hasUserRating && canRate && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Ваш отзыв</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <StarRating rating={userRating?.rating || 0} readonly />
                  {userRating?.comment && (
                    <p className="text-gray-700 text-sm">{userRating.comment}</p>
                  )}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowRatingForm(true)}
                    >
                      Редактировать
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={handleDeleteRating}
                    >
                      Удалить
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Список отзывов */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Отзывы ({ratingsData?.data?.totalCount || 0})
                </CardTitle>
                
                {/* Сортировка */}
                <Select value={sortBy} onValueChange={(value) => {
                  setSortBy(value as "createdAt" | "rating" | "helpful");
                  setPage(1);
                }}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Сначала новые</SelectItem>
                    <SelectItem value="rating">По рейтингу</SelectItem>
                    <SelectItem value="helpful">Самые полезные</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <RatingList
                ratings={ratings}
                onMarkHelpful={handleMarkHelpful}
                currentUserId={user?.id}
                isLoading={ratingsLoading}
              />

              {/* Пагинация */}
              {ratingsData?.data && ratingsData.data.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    disabled={!ratingsData.data.hasPrev}
                    onClick={() => setPage(page - 1)}
                  >
                    Предыдущая
                  </Button>
                  <span className="flex items-center px-4">
                    Страница {ratingsData.data.currentPage} из {ratingsData.data.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={!ratingsData.data.hasNext}
                    onClick={() => setPage(page + 1)}
                  >
                    Следующая
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
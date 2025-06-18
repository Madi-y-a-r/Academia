"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import StarRating from "./StarRating";

interface RatingFormProps {
  courseId: string;
  existingRating?: Rating;
  onSubmit: (rating: number, comment: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function RatingForm({
  courseId,
  existingRating,
  onSubmit,
  onCancel,
  isLoading = false,
}: RatingFormProps) {
  const [rating, setRating] = useState(existingRating?.rating || 0);
  const [comment, setComment] = useState(existingRating?.comment || "");

  useEffect(() => {
    if (existingRating) {
      setRating(existingRating.rating);
      setComment(existingRating.comment || "");
    }
  }, [existingRating]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Пожалуйста, выберите оценку");
      return;
    }
    onSubmit(rating, comment);
  };

  const isEdit = Boolean(existingRating);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg">
          {isEdit ? "Редактировать отзыв" : "Оставить отзыв"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Рейтинг звездами */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ваша оценка *
            </label>
            <StarRating
              rating={rating}
              onRatingChange={setRating}
              size="large"
            />
          </div>

          {/* Комментарий */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Комментарий (необязательно)
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Поделитесь своими впечатлениями о курсе..."
              rows={4}
              maxLength={1000}
              className="resize-none"
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {comment.length}/1000
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={isLoading || rating === 0}
              className="flex-1"
            >
              {isLoading ? "Сохранение..." : isEdit ? "Обновить" : "Опубликовать"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
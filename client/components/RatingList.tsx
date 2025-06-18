"use client";

import { ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import StarRating from "./StarRating";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

export default function RatingList({
  ratings,
  onMarkHelpful,
  currentUserId,
  isLoading = false,
}: RatingListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (ratings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Пока нет отзывов</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {ratings.map((rating) => {
        const isHelpfulByUser = currentUserId && rating.helpfulVotes.includes(currentUserId);
        const canMarkHelpful = currentUserId && currentUserId !== rating.userId;
        
        return (
          <Card key={rating.ratingId} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex gap-3">
                {/* Аватар пользователя */}
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {rating.userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  {/* Заголовок отзыва */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-gray-900">
                      {rating.userName}
                    </span>
                    <StarRating rating={rating.rating} readonly size="small" />
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(rating.createdAt), {
                        addSuffix: true,
                        locale: ru,
                      })}
                    </span>
                  </div>

                  {/* Комментарий */}
                  {rating.comment && (
                    <p className="text-gray-700 mb-3 leading-relaxed">
                      {rating.comment}
                    </p>
                  )}

                  {/* Действия */}
                  <div className="flex items-center gap-2">
                    {canMarkHelpful && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onMarkHelpful(rating.ratingId)}
                        className={`h-8 px-2 ${
                          isHelpfulByUser
                            ? "text-blue-600 bg-blue-50"
                            : "text-gray-500 hover:text-blue-600"
                        }`}
                      >
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        Полезно
                        {rating.helpfulCount > 0 && (
                          <span className="ml-1 text-xs">
                            ({rating.helpfulCount})
                          </span>
                        )}
                      </Button>
                    )}
                    
                    {!canMarkHelpful && rating.helpfulCount > 0 && (
                      <div className="flex items-center text-gray-500 text-sm">
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        <span>{rating.helpfulCount}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
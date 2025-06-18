"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StarRating({
  rating,
  onRatingChange,
  size = "medium",
  readonly = false,
}: StarRatingProps) {
  const sizes = {
    small: "w-4 h-4",
    medium: "w-5 h-5",
    large: "w-6 h-6",
  };

  const handleStarClick = (starRating: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  const handleStarHover = (starRating: number) => {
    if (!readonly && onRatingChange) {
      // Можно добавить hover эффект в будущем
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={cn(
            "transition-colors duration-200",
            !readonly && "hover:scale-110 cursor-pointer",
            readonly && "cursor-default"
          )}
          onClick={() => handleStarClick(star)}
          onMouseEnter={() => handleStarHover(star)}
          disabled={readonly}
        >
          <Star
            className={cn(
              sizes[size],
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200",
              !readonly && "hover:fill-yellow-300 hover:text-yellow-300"
            )}
          />
        </button>
      ))}
    </div>
  );
}
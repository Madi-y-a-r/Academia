"use client";

import StarRating from "./StarRating";
import { Progress } from "@/components/ui/progress";

export default function RatingStats({
  stats,
  showDistribution = true,
}: RatingStatsProps) {
  const { averageRating, ratingCount, ratingDistribution } = stats;

  if (ratingCount === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">Пока нет оценок</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Основная статистика */}
      <div className="flex items-center gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">
            {averageRating.toFixed(1)}
          </div>
          <StarRating rating={Math.round(averageRating)} readonly size="small" />
          <div className="text-sm text-gray-500 mt-1">
            {ratingCount} {ratingCount === 1 ? "оценка" : "оценок"}
          </div>
        </div>
      </div>

      {/* Распределение оценок */}
      {showDistribution && ratingDistribution && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-700">Распределение оценок</h4>
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingDistribution[star - 1] || 0;
            const percentage = ratingCount > 0 ? (count / ratingCount) * 100 : 0;
            
            return (
              <div key={star} className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1 w-12">
                  <span>{star}</span>
                  <StarRating rating={1} readonly size="small" />
                </div>
                <Progress 
                  value={percentage} 
                  className="flex-1 h-2" 
                />
                <span className="w-8 text-right text-gray-500">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
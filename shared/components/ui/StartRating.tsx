"use client";
import { Star } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showNumber?: boolean;
  setStarsRating?: Dispatch<SetStateAction<number>>;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  showNumber = true,
  setStarsRating,
}: StarRatingProps) {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }).map((_, index) => {
        const starValue = index + 1;

        return (
          <Star
            key={index}
            className={`${sizeClasses[size]} cursor-pointer ${
              starValue <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
            onClick={() => setStarsRating?.(starValue)}
          />
        );
      })}

      {showNumber && (
        <span className="text-sm text-gray-600 ml-1">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}

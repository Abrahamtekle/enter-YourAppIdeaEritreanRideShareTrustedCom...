import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: "sm" | "md";
  showCount?: number;
  className?: string;
}

export function StarRating({ rating, max = 5, size = "sm", showCount, className }: StarRatingProps) {
  const iconSize = size === "sm" ? 12 : 16;

  return (
    <span className={cn("inline-flex items-center gap-0.5", className)}>
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={iconSize}
          className={
            i < Math.round(rating)
              ? "fill-star-active text-star-active"
              : "fill-star-inactive text-star-inactive"
          }
        />
      ))}
      {showCount !== undefined && (
        <span className="ml-1 text-xs text-muted-foreground">
          {rating.toFixed(1)} ({showCount})
        </span>
      )}
    </span>
  );
}

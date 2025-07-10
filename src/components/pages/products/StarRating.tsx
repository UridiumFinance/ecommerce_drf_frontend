import { StarIcon } from "@heroicons/react/20/solid";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export interface StarRatingProps {
  averageRating: number;
  reviewCount: number;
  maxStars?: number;
  starSizeClassName?: string;
  filledColorClassName?: string;
  emptyColorClassName?: string;
  className?: string;
}

export default function StarRating({
  averageRating,
  reviewCount,
  maxStars = 5,
  starSizeClassName = "h-4 w-auto flex-shrink-0",
  filledColorClassName = "text-yellow-500",
  emptyColorClassName = "text-gray-200",
  className = "flex flex-nowrap items-center space-x-2",
}: StarRatingProps) {
  const rating = typeof averageRating === "number" ? averageRating : 0;
  const ratings = typeof reviewCount === "number" ? reviewCount : 0;

  return (
    <div className={className}>
      {/* Display numeric average rating */}
      <p className="font-medium">{Number(rating.toFixed(1))}</p>
      <div className="flex">
        {/* Render stars based on averageRating */}
        {Array.from({ length: maxStars }).map((_, index) => {
          const isFilled = rating > index;
          return (
            <StarIcon
              key={index}
              className={classNames(
                isFilled ? filledColorClassName : emptyColorClassName,
                starSizeClassName,
              )}
              aria-hidden="true"
            />
          );
        })}
      </div>
      {/* Display review count */}
      <span className={filledColorClassName}>({ratings})</span>
    </div>
  );
}

StarRating.defaultProps = {
  maxStars: 5,
  starSizeClassName: "h-4 w-auto flex-shrink-0",
  filledColorClassName: "text-yellow-500",
  emptyColorClassName: "text-gray-200",
  className: "flex flex-nowrap items-center space-x-2",
};

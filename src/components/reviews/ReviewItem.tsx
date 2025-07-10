import classNames from "@/utils/classnames";
import { StarIcon } from "@heroicons/react/20/solid";

interface ReviewItemProps {
  review: any;
}

export default function ReviewItem({ review }: ReviewItemProps) {
  return (
    <div key={review.id} className="py-12">
      <div className="flex items-center">
        <img alt={`${review.author}.`} src={review.avatarSrc} className="size-12 rounded-full" />
        <div className="ml-4">
          <h4 className="text-sm font-bold text-gray-900">{review.author}</h4>
          <div className="mt-1 flex items-center">
            {[0, 1, 2, 3, 4].map(rating => (
              <StarIcon
                key={rating}
                aria-hidden="true"
                className={classNames(
                  review.rating > rating ? "text-yellow-400" : "text-gray-300",
                  "size-5 shrink-0",
                )}
              />
            ))}
          </div>
          <p className="sr-only">{review.rating} out of 5 stars</p>
        </div>
      </div>

      <div
        dangerouslySetInnerHTML={{ __html: review.content }}
        className="mt-4 space-y-6 text-base text-gray-600 italic"
      />
    </div>
  );
}

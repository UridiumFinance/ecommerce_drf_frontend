import { IReview } from "@/interfaces/reviews/IReview";
import ReviewItem from "./ReviewItem";

interface ReviewsListProps {
  reviews: IReview[];
}

export default function ReviewsList({ reviews }: ReviewsListProps) {
  return (
    <div className="flow-root">
      <div className="-my-12 divide-y divide-gray-200">
        {reviews?.map(review => <ReviewItem review={review} key={review.id} />)}
      </div>
    </div>
  );
}

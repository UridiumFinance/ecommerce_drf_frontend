import ReviewItem from "./ReviewItem";

interface ReviewsListProps {
  reviews: any[];
}

export default function ReviewsList({ reviews }: ReviewsListProps) {
  return (
    <div className="flow-root">
      <div className="-my-12 divide-y divide-gray-200">
        {reviews?.featured.map(review => <ReviewItem review={review} key={review.id} />)}
      </div>
    </div>
  );
}

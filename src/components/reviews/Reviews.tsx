import classNames from "@/utils/classnames";
import { StarIcon } from "@heroicons/react/20/solid";
import useReviews from "@/hooks/reviews/useReviews";
import ReviewsList from "./ReviewsList";
import StandardPagination from "../pagination/StandardPagination";

interface ComponentProps {
  contentType: string;
  objectId: string | undefined;
}

export default function Reviews({ contentType, objectId }: ComponentProps) {
  const {
    review,
    reviews,
    average,
    counts,
    totalCount,
    loadingReviews,
    count,
    pageSize,
    currentPage,
    setCurrentPage,
  } = useReviews({
    contentType,
    objectId,
    fetchListOnLoad: true,
    fetchReviewOnLoad: true,
  });

  console.log("count", count);
  console.log("pageSize", pageSize);
  console.log("currentPage", currentPage);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl py-16 lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-x-8">
        <div className="lg:col-span-4">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Customer Reviews</h2>

          <div className="mt-3 flex items-center">
            <div>
              <div className="flex items-center">
                {[0, 1, 2, 3, 4].map(rating => (
                  <StarIcon
                    key={rating}
                    aria-hidden="true"
                    className={classNames(
                      average > rating ? "text-yellow-400" : "text-gray-300",
                      "size-5 shrink-0",
                    )}
                  />
                ))}
              </div>
              <p className="sr-only">{average} out of 5 stars</p>
            </div>
            <p className="ml-2 text-sm text-gray-900">Based on {totalCount} reviews</p>
          </div>

          <div className="mt-6">
            <h3 className="sr-only">Review data</h3>

            <dl className="space-y-3">
              {counts?.map(count => (
                <div key={count.rating} className="flex items-center text-sm">
                  <dt className="flex flex-1 items-center">
                    <p className="w-3 font-medium text-gray-900">
                      {count.rating}
                      <span className="sr-only"> star reviews</span>
                    </p>
                    <div aria-hidden="true" className="ml-1 flex flex-1 items-center">
                      <StarIcon
                        aria-hidden="true"
                        className={classNames(
                          count.count > 0 ? "text-yellow-400" : "text-gray-300",
                          "size-5 shrink-0",
                        )}
                      />

                      <div className="relative ml-3 flex-1">
                        <div className="h-3 rounded-full border border-gray-200 bg-gray-100" />
                        {count.count > 0 ? (
                          <div
                            style={{ width: `calc(${count.count} / ${totalCount} * 100%)` }}
                            className="absolute inset-y-0 rounded-full border border-yellow-400 bg-yellow-400"
                          />
                        ) : null}
                      </div>
                    </div>
                  </dt>
                  <dd className="ml-3 w-10 text-right text-sm text-gray-900 tabular-nums">
                    {Math.round((count.count / totalCount) * 100)}%
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* <div className="mt-10">
            <h3 className="text-lg font-medium text-gray-900">Share your thoughts</h3>
            <p className="mt-1 text-sm text-gray-600">
              If you’ve used this product, share your thoughts with other customers
            </p>

            <button
              type="button"
              className="mt-6 inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-8 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 sm:w-auto lg:w-full"
            >
              Write a review
            </button>
          </div> */}
        </div>

        <div className="mt-16 lg:col-span-7 lg:col-start-6 lg:mt-0">
          <h3 className="sr-only">Recent reviews</h3>

          <ReviewsList reviews={reviews} />
          <StandardPagination
            data={reviews}
            count={count}
            pageSize={pageSize}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}

export default function LoadingProductCard() {
  return (
    <div>
      <div className="relative">
        {/* Image */}
        <div className="relative h-72 w-full overflow-hidden rounded-lg">
          <div className="size-full animate-pulse bg-gray-200" />
        </div>

        {/* Text */}
        <div className="relative mt-4">
          <div className="h-4 w-full animate-pulse rounded-lg bg-gray-200" />
          <div className="mt-2 h-2 w-1/4 animate-pulse rounded-lg bg-gray-200" />
        </div>

        <div className="absolute inset-x-0 top-0 flex h-72 items-end justify-end overflow-hidden rounded-lg p-4">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-10"
          />
          {/* Price */}
          <div className="h-2 w-1/4 animate-pulse rounded-lg bg-gray-200" />
        </div>
      </div>

      {/* Button */}
      <div className="mt-6">
        <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200" />
      </div>
    </div>
  );
}

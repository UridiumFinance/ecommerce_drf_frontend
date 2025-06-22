export default function LoadingProductCard() {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
      {/* Skeleton para la imagen principal */}
      <div className="aspect-[3/4] w-96 bg-gray-200 object-cover group-hover:opacity-75 sm:aspect-auto sm:h-96 sm:w-72" />

      <div className="flex flex-1 flex-col space-y-2 p-4">
        {/* Title */}
        <div className="h-6 w-full animate-pulse rounded-lg bg-gray-200" />
        {/* Description */}
        <div className="h-2 w-full animate-pulse rounded-lg bg-gray-200" />
        <div className="h-2 w-full animate-pulse rounded-lg bg-gray-200" />
        {/* Price */}
        <div className="h-2 w-1/4 animate-pulse rounded-lg bg-gray-200" />
      </div>
    </article>
  );
}

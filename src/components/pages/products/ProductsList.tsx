import { useEffect, useRef } from "react";
import { IProductList } from "@/interfaces/products/IProduct";
import LoadingProductCard from "@/components/loaders/LoadingProductCard";
import Button from "@/components/Button";
import LoadingMoon from "@/components/loaders/LoadingMoon";
import StandardPagination from "@/components/pagination/StandardPagination";

import ProductCard from "./ProductCard";

interface ComponentProps {
  products: IProductList[];
  loading: boolean;
  loadingMore: boolean;
  loadMore: any;
  nextUrl: string;
  infiniteScroll?: boolean;
  pagination?: boolean;
  count?: number;
  pageSize?: number;
  currentPage?: number;
  setCurrentPage?: any;
  title?: string;
  horizontal?: boolean;
}

export default function ProductsList({
  products,
  loading,
  loadingMore,
  loadMore,
  nextUrl,
  infiniteScroll = false,
  pagination = false,
  count = 0,
  pageSize = 12,
  currentPage = 1,
  setCurrentPage = null,
  title = "",
  horizontal = false,
}: ComponentProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (infiniteScroll && nextUrl) {
      const observer = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting && !loadingMore) {
            loadMore();
          }
        },
        { threshold: 1.0 },
      );

      const currentRef = bottomRef.current;
      if (currentRef) observer.observe(currentRef);

      return () => {
        if (currentRef) observer.unobserve(currentRef);
      };
    }

    return undefined;
  }, [infiniteScroll, nextUrl, loadingMore, loadMore]);

  const topRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (pagination && topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentPage, pagination]);

  if (horizontal) {
    return <div>HORIZONTAL</div>;
  }

  return (
    <div>
      {title !== "" && (
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-0">
          <h3 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h3>
          {/* <div className="mt-3 sm:mt-0 sm:ml-4">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Create new job
            </button>
          </div> */}
        </div>
      )}

      <div
        ref={topRef}
        className="row-start-2 my-4 flex flex-col items-center gap-[32px] sm:items-start"
      >
        <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => <LoadingProductCard key={index} />)
            : products.map(product => <ProductCard key={product?.id} product={product} />)}
        </div>
        {!pagination && (
          <>
            {!infiniteScroll && nextUrl && (
              <Button onClick={loadMore} disabled={loadingMore} className="w-full">
                {loadingMore ? <LoadingMoon /> : "Load More"}
              </Button>
            )}

            {infiniteScroll && nextUrl && <div ref={bottomRef} className="h-1" />}
          </>
        )}
      </div>

      {pagination && (
        <div>
          <StandardPagination
            data={products}
            count={count}
            pageSize={pageSize}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}

ProductsList.defaultProps = {
  infiniteScroll: false,
  pagination: false,
  horizontal: false,
  count: 0,
  pageSize: 12,
  currentPage: 1,
  setCurrentPage: null,
  title: "",
};

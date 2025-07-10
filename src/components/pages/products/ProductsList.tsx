import { ReactNode, useEffect, useRef, useState } from "react";
import { IProductList } from "@/interfaces/products/IProduct";
import LoadingProductCard from "@/components/loaders/LoadingProductCard";
import Button from "@/components/Button";
import LoadingMoon from "@/components/loaders/LoadingMoon";
import StandardPagination from "@/components/pagination/StandardPagination";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";

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
  description?: string;
  horizontal?: boolean;
  cta?: ReactNode;
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
  description = "",
  horizontal = false,
  cta = <div />,
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

  const [emblaApi, setEmblaApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState<boolean>(false);
  const [canScrollNext, setCanScrollNext] = useState<boolean>(false);

  useEffect(() => {
    // si no hay API aún, salimos del effect (no es un retorno de valor, es un short-circuit del effect)
    if (!emblaApi) return;

    const onSelect = () => {
      // Actualizamos siempre los estados de scroll
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());

      // Lógica de infinite scroll, pero sin return
      if (infiniteScroll && nextUrl && !loadingMore) {
        const lastIndex = emblaApi.scrollSnapList().length - 1;
        const selectedIndex = emblaApi.selectedScrollSnap();
        if (selectedIndex === lastIndex) {
          loadMore();
        }
      }
    };

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    // Ejecutamos una vez al montar / reinicializar
    onSelect();

    // eslint-disable-next-line
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, infiniteScroll, nextUrl, loadingMore, loadMore]);

  if (horizontal) {
    return (
      <div>
        {title !== "" && (
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-0">
            <div className="mt-4 ml-4">
              {title !== "" && <h3 className="text-base font-semibold text-gray-900">{title}</h3>}
              {description !== "" && (
                <p className="mt-1 text-sm text-gray-500">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit quam corrupti consectetur.
                </p>
              )}
            </div>

            {cta && <div className="mt-4 ml-4 shrink-0">{cta}</div>}
          </div>
        )}
        <div className="my-4">
          <Carousel
            setApi={setEmblaApi}
            opts={{
              align: "start",
            }}
            className="w-full max-w-full"
          >
            <CarouselContent>
              {loading
                ? Array.from({ length: 4 }).map((_, idx) => (
                    <CarouselItem
                      key={`loading-${idx}`}
                      className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                    >
                      <div className="p-1">
                        <LoadingProductCard />
                      </div>
                    </CarouselItem>
                  ))
                : products.map((product, idx) => (
                    <CarouselItem
                      key={product.id ?? idx}
                      className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                    >
                      <div className="p-1">
                        <ProductCard product={product} />
                      </div>
                    </CarouselItem>
                  ))}
            </CarouselContent>
            {canScrollPrev && (
              <button
                onClick={() => emblaApi?.scrollPrev()}
                className="absolute top-1/2 -left-4 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg hover:bg-gray-100 focus:outline-none"
              >
                <ChevronLeftIcon className="h-5 w-5 text-gray-700" />
              </button>
            )}
            {canScrollNext && (
              <button
                onClick={() => emblaApi?.scrollNext()}
                className="absolute top-1/2 -right-4 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg hover:bg-gray-100 focus:outline-none"
              >
                <ChevronRightIcon className="h-5 w-5 text-gray-700" />
              </button>
            )}
          </Carousel>
        </div>
      </div>
    );
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
  description: "",
  cta: <div />,
};

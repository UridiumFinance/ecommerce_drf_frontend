import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { ICategory } from "@/interfaces/products/ICategory";
import { ReactNode, useEffect, useState } from "react";
import CategoryCard from "./CategoryCard";
import LoadingCategoryCard from "@/components/loaders/LoadingCategoryCard";

interface ComponentProps {
  categories: ICategory[];
  loading: boolean;
  loadingMore: boolean;
  loadMore: any;
  nextUrl: string;
  title?: string;
  description?: string;
  cta?: ReactNode;
  infiniteScroll?: boolean;
}

export default function CategoriesList({
  categories,
  title = "",
  description = "",
  cta = <div />,
  loading,
  loadingMore,
  loadMore,
  nextUrl,
  infiniteScroll = false,
}: ComponentProps) {
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
                      <LoadingCategoryCard />
                    </div>
                  </CarouselItem>
                ))
              : categories.map((category, idx) => (
                  <CarouselItem
                    key={category.id ?? idx}
                    className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                  >
                    <div className="p-1">
                      <CategoryCard category={category} />
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

CategoriesList.defaultProps = {
  title: "",
  description: "",
  cta: <div />,
  infiniteScroll: false,
};

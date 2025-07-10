import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface ComponentProps {
  images: string[];
}

export default function ImageGallery({ images }: ComponentProps) {
  const [thumbApi, setThumbApi] = useState<CarouselApi>();
  const [mainApi, setMainApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onMainSelect = useCallback(() => {
    if (!mainApi) return;
    const idx = mainApi.selectedScrollSnap();
    setSelectedIndex(idx);
    thumbApi?.scrollTo(idx);
  }, [mainApi, thumbApi]);

  useEffect(() => {
    if (!mainApi) return;
    onMainSelect();
    mainApi.on("select", onMainSelect).on("reInit", onMainSelect);
    return () => {
      mainApi.off("select", onMainSelect).off("reInit", onMainSelect);
    };
  }, [mainApi, onMainSelect]);

  const handleThumbClick = (idx: number) => {
    setSelectedIndex(idx);
    mainApi?.scrollTo(idx);
  };

  return (
    <div className="flex flex-col-reverse">
      {/* Selector de thumbnails */}
      <Carousel
        setApi={setThumbApi}
        opts={{
          align: "center",
          containScroll: "keepSnaps",
          dragFree: true,
        }}
        className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none"
      >
        <CarouselContent className="grid grid-cols-4 gap-6">
          {images?.map((image, idx) => (
            <CarouselItem
              key={idx}
              onClick={() => handleThumbClick(idx)}
              className={`relative h-24 cursor-pointer rounded-md transition duration-300 ease-in-out focus:outline-none ${selectedIndex === idx ? "scale-110 shadow-lg" : "scale-100"} `}
            >
              {/* Placeholder gris */}
              <span className="absolute inset-0 overflow-hidden rounded-md">
                <Image
                  width={512}
                  height={512}
                  alt={`Thumbnail ${idx + 1}`}
                  src={image}
                  className="size-full object-cover"
                />
              </span>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* <CarouselPrevious className="absolute top-1/2 left-2 z-10 sm:left-4" /> */}
        {/* <CarouselNext className="absolute top-1/2 right-2 z-10 sm:right-4" /> */}
      </Carousel>

      {/* Panel principal */}
      <Carousel
        setApi={setMainApi}
        opts={{
          align: "center",
        }}
      >
        <CarouselContent>
          {images?.map((src, idx) => (
            <CarouselItem key={idx}>
              <Image
                width={512}
                height={512}
                alt={`Imagen ${idx + 1}`}
                src={src}
                className="aspect-square w-full cursor-pointer object-cover sm:rounded-lg"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}

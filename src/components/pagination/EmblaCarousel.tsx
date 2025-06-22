import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaOptionsType } from "embla-carousel";

interface EmblaCarouselProps {
  slides: React.ReactNode[];
  options?: EmblaOptionsType;
}

export default function EmblaCarousel({ slides, options }: EmblaCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <div ref={emblaRef} className="relative w-full overflow-hidden">
      {/* Container de slides */}
      <div className="flex touch-pan-x select-none">
        {slides.map((slide, idx) => (
          <div key={idx} className="box-border w-full flex-none">
            {slide}
          </div>
        ))}
      </div>

      {/* Botones */}
      <button
        onClick={scrollPrev}
        aria-label="Anterior"
        className="absolute top-1/2 left-4 z-10 -translate-y-1/2 rounded bg-white/80 p-2 shadow hover:bg-white"
      >
        ‹
      </button>
      <button
        onClick={scrollNext}
        aria-label="Siguiente"
        className="absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded bg-white/80 p-2 shadow hover:bg-white"
      >
        ›
      </button>
    </div>
  );
}

EmblaCarousel.defaultProps = {
  options: {
    loop: false,
    dragFree: false,
    align: "start",
  },
};

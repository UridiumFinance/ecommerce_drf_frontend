import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { ReactNode, useEffect, useState } from "react";

function Arrow({
  disabled,
  left,
  onClick,
}: {
  disabled: boolean;
  left?: boolean;
  onClick: (e: any) => void;
}) {
  const disabledClass = disabled ? "arrow--disabled" : "";
  return (
    <button
      type="button"
      onClick={!disabled ? onClick : undefined}
      className={`arrow ${left ? "arrow--left" : "arrow--right"} ${disabledClass}`}
    >
      {left ? (
        <ChevronLeftIcon className="h-6 w-6 text-gray-800" />
      ) : (
        <ChevronRightIcon className="h-6 w-6 text-gray-800" />
      )}
    </button>
  );
}

interface KeenCarouselProps<T> {
  loading: boolean;
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  showArrows?: boolean;
  showDots?: boolean;
}

export default function KeenCarousel<T>({
  loading,
  items,
  renderItem,
  showArrows = true,
  showDots = true,
}: KeenCarouselProps<T>) {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [perView, setPerView] = useState<number>(3);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    slides: {
      perView,
      spacing: 15,
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

  // Update perView based on window width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 900) {
        setPerView(1); // Show 1 post on small screens
      } else {
        setPerView(3); // Show 3 posts on larger screens
      }
    };

    // Initial check and event listener for window resize
    handleResize();
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Only initialize the slider when posts are loaded
  useEffect(() => {
    if (!loading && items.length > 0 && instanceRef.current) {
      instanceRef.current.update(); // Update the Keen Slider
      setLoaded(true); // Mark the slider as loaded
    }
  }, [loading, items, instanceRef]);

  // Ensure sliderRef is available
  useEffect(() => {
    if (instanceRef.current) {
      instanceRef.current.update(); // Update slider if needed
    }
  }, [instanceRef]);

  return (
    <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
      {/* Keen Slider */}
      <div ref={sliderRef} className="keen-slider">
        {items.map((item, idx) => (
          <div key={idx} className="keen-slider__slide">
            {renderItem(item, idx)}
          </div>
        ))}
      </div>

      {/* Arrows */}
      {showArrows && loaded && instanceRef.current && (
        <div className="hidden 2xl:flex">
          <Arrow
            left
            onClick={(e: any) => e.stopPropagation() || instanceRef.current?.prev()}
            disabled={currentSlide === 0}
          />
          <Arrow
            onClick={(e: any) => e.stopPropagation() || instanceRef.current?.next()}
            disabled={currentSlide === instanceRef.current.track.details.slides.length - 3}
          />
        </div>
      )}

      {/* Dots */}
      {showDots && loaded && instanceRef.current && (
        <div className="dots">
          {[...Array(instanceRef.current.track.details.slides.length - (perView - 1)).keys()].map(
            idx => (
              <button
                type="button"
                key={idx}
                onClick={() => {
                  instanceRef.current?.moveToIdx(idx);
                }}
                aria-label={`Go to slide ${idx + 1}`} // Adding an accessible label
                className={`dot ${currentSlide === idx ? "active" : ""}`}
              />
            ),
          )}
        </div>
      )}
    </div>
  );
}

Arrow.defaultProps = {
  left: false,
};

KeenCarousel.defaultProps = {
  showArrows: false,
  showDots: false,
};

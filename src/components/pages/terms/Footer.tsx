import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { useRouter } from "next/router";

export default function TermsFooter({ sections }: { sections: any }) {
  const router = useRouter();

  const getCurrentIndex = () => {
    return sections.findIndex(section => section.href === router.pathname);
  };

  const currentIndex = getCurrentIndex();

  const handlePrevious = () => {
    if (currentIndex > 0) {
      router.push(sections[currentIndex - 1].href);
    }
  };

  const handleNext = () => {
    if (currentIndex < sections.length - 1) {
      router.push(sections[currentIndex + 1].href);
    }
  };

  return (
    <footer className="flex">
      {currentIndex !== 0 ? (
        <div className="flex flex-col items-start gap-3">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="dark:border-dark-border dark:text-dark-txt dark:hover:bg-dark-second flex flex-nowrap items-center rounded-full border px-4 py-2 font-bold hover:bg-gray-50"
          >
            <ArrowLeftIcon className="mr-2 h-5 w-auto" /> Previous
          </button>

          <Link
            className="text-base font-semibold text-zinc-900 transition hover:text-zinc-600 dark:text-white dark:hover:text-zinc-300"
            href={sections[currentIndex - 1]?.href}
          >
            {sections[currentIndex - 1]?.title}
          </Link>
          {/* <Button
            href={sections[currentIndex - 1].href}
            aria-label={`Previous: ${sections[currentIndex - 1].title}`}
            variant="secondary"
            arrow={'right'}
          >
            Previous
          </Button> */}
        </div>
      ) : (
        <div />
      )}
      {currentIndex !== sections.length - 1 ? (
        <div className="ml-auto flex flex-col items-end gap-3">
          <button
            type="button"
            onClick={handleNext}
            disabled={currentIndex === sections.length - 1}
            className="dark:border-dark-border dark:text-dark-txt dark:hover:bg-dark-second flex flex-nowrap items-center rounded-full border px-4 py-2 font-bold hover:bg-gray-50"
          >
            Next <ArrowRightIcon className="ml-2 h-5 w-auto" />
          </button>
          <Link
            href={sections[currentIndex + 1]?.href}
            className="text-base font-semibold text-zinc-900 transition hover:text-zinc-600 dark:text-white dark:hover:text-zinc-300"
          >
            {sections[currentIndex + 1]?.title}
          </Link>
        </div>
      ) : (
        <div />
      )}
    </footer>
  );
}

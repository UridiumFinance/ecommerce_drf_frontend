import Link from "next/link";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function TermNavigationItem({ section }: string) {
  return (
    <div className="flex items-center">
      <Link
        href={section.href}
        className={classNames(
          section.current ? "bg-indigo-600 text-white" : "text-gray-700 hover:text-indigo-600",
          "group flex w-full gap-x-3 p-2 leading-6",
        )}
      >
        <span className="ml-2 font-bold">{section.title}</span>
      </Link>
    </div>
  );
}

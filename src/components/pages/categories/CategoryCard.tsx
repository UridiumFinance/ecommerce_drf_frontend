import { ICategory } from "@/interfaces/products/ICategory";
import Link from "next/link";

interface ComponentProps {
  category: ICategory;
}

export default function CategoryCard({ category }: ComponentProps) {
  return (
    <Link href={`/topic/${category?.slug}`}>
      <div className="rounded-full border bg-gray-50 p-4 text-center hover:bg-gray-100">
        {category?.name}
      </div>
    </Link>
  );
}

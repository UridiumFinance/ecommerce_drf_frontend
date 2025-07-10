import { IProductList } from "@/interfaces/products/IProduct";
import Image from "next/image";
import Link from "next/link";
import StarRating from "./StarRating";

interface ComponentProps {
  product: IProductList;
}

export default function ProductCardHorizontal({ product }: ComponentProps) {
  const truncatedTitle =
    product?.title.length > 120 ? `${product?.title.slice(0, 120)}...` : product?.title;
  const truncatedTitleMobile =
    product?.title.length > 69 ? `${product?.title.slice(0, 69)}...` : product?.title;

  return (
    <div className="relative flex w-full flex-col md:flex-row">
      {/* Imagen */}
      {product?.thumbnail && (
        <div className="dark:bg-dark-bg relative grid w-full place-items-center md:w-5/12">
          <div className="relative h-36 w-full">
            <Image
              src={product?.thumbnail}
              alt={product?.title}
              layout="fill"
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* Contenido */}
      <div className="relative flex w-full flex-col md:flex-row">
        <div className="mx-1 my-4 w-full md:mx-0 md:-my-1 md:ml-4">
          {/* Categoría */}
          {/* <p className="text-xs font-semibold text-blue-500">
            <Link
              className="hover:underline hover:underline-offset-4"
              href={`/topic/${product?.category?.slug}`}
            >
              {product?.category?.name}
            </Link>
          </p> */}
          {/* Título y Precio */}
          <div className="flex w-full items-center justify-between">
            {/* Título prende todo el hueco y se trunca si es muy largo */}
            <h2 className="min-w-0 flex-1 text-sm font-bold text-gray-900">
              <Link href={`/store/${product.slug}`}>
                <div className="block truncate">
                  {/* Desktop vs mobile truncado */}
                  <span className="hidden md:inline">{truncatedTitle}</span>
                  <span className="inline md:hidden">{truncatedTitleMobile}</span>
                </div>
              </Link>
            </h2>

            {/* Precio se mantiene fijo a la derecha */}
            <span className="ml-4 flex-shrink-0 text-lg font-semibold text-gray-900">
              $ {product?.price}
            </span>
          </div>

          {/* Descripción */}
          <p className="dark:text-dark-txt-secondary my-1 mr-12 hidden text-sm text-gray-600 select-none md:flex">
            {product?.short_description?.length > 46
              ? product?.short_description.slice(0, 200)
              : product?.short_description}
          </p>
          <p className="dark:text-dark-txt-secondary my-1 flex text-sm text-gray-600 select-none md:hidden">
            {product?.short_description?.length > 100
              ? `${product?.short_description?.slice(0, 100)}...`
              : product?.short_description}
          </p>

          {/* Rating */}
          <StarRating averageRating={product?.average_rating} reviewCount={product?.review_count} />
        </div>
      </div>
    </div>
  );
}

import { IProductList } from "@/interfaces/products/IProduct";
import Image from "next/image";
import Link from "next/link";
import useProductPrice from "@/hooks/useProductPrice";
import { useMemo } from "react";
import LoadingMoon from "../loaders/LoadingMoon";
import StarRating from "../pages/products/StarRating";

interface ComponentProps {
  product: IProductList;
  loadingRemoveFromCart: boolean;
  count: number;
  maxCount: number;
  onRemove?: () => void;
  onSaveForLater?: () => void;
  onUpdateCount?: (newCount: number) => void;
  moveActionText?: string;
  selectedAttributes: any[];
}

export default function ProductCardHorizontal({
  product,
  count,
  maxCount,
  onRemove,
  onSaveForLater,
  onUpdateCount,
  moveActionText = "Save for Later",
  selectedAttributes,
  loadingRemoveFromCart,
}: ComponentProps) {
  const truncatedTitle =
    product?.title.length > 120 ? `${product?.title.slice(0, 120)}...` : product?.title;
  const truncatedTitleMobile =
    product?.title.length > 69 ? `${product?.title.slice(0, 69)}...` : product?.title;

  // const { basePrice, discountPrice } = useProductPrice({
  //   slug: product?.slug,
  //   colorId: selectedAttributes?.color_id,
  //   sizeId: selectedAttributes?.size_id,
  //   materialId: selectedAttributes?.material_id,
  //   weightId: selectedAttributes?.weight_id,
  //   flavorId: selectedAttributes?.flavor_id,
  // });

  // const isDiscountActive = useMemo(() => {
  //   if (!product?.discount || !product.discount_until) return false;
  //   const now = new Date();
  //   const until = new Date(product.discount_until);
  //   return until > now;
  // }, [product?.discount, product?.discount_until]);

  // // Mostramos descuento sólo si el API nos devolvió un discountPrice menor
  // const showDiscount = isDiscountActive && discountPrice < basePrice;

  return (
    <div className="flex flex-col gap-4 border-b border-gray-200 py-4 md:flex-row md:items-start">
      {/* Imagen */}
      <div className="relative h-20 w-28 flex-shrink-0 md:h-24 md:w-32">
        {product?.thumbnail && (
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="128px"
            quality={90} // ← más calidad
            className="rounded object-cover"
          />
        )}
      </div>

      {/* Contenido */}
      <div className="flex flex-1 flex-col justify-between">
        {/* Título y precio */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <h2 className="text-base font-bold text-gray-900 md:max-w-[60%]">
            <Link href={`/store/${product.slug}`}>
              <span className="hover:underline">
                <span className="hidden md:inline">{truncatedTitle}</span>
                <span className="inline md:hidden">{truncatedTitleMobile}</span>
              </span>
            </Link>
          </h2>
          <div className="flex items-center space-x-4">
            {onUpdateCount && (
              <select
                id={`quantity-${product.id}`}
                className="rounded border p-1"
                value={count}
                onChange={e => onUpdateCount?.(Number(e.target.value))}
              >
                {Array.from({ length: maxCount }, (_, i) => i + 1).map(n => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            )}
            {/* {showDiscount ? (
              <div className="flex items-center space-x-4">
                <p className="text-sm tracking-tight text-gray-500 line-through">
                  $ {basePrice.toFixed(2)}
                </p>

                <p className="text-sm tracking-tight text-gray-900">$ {discountPrice.toFixed(2)}</p>

                <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-600/10 ring-inset">
                  {Math.round(((basePrice - discountPrice) / basePrice) * 100)}% off
                </span>
              </div>
            ) : (
              // Precio normal sin descuento
              <p className="text-sm tracking-tight text-gray-900">$ {basePrice.toFixed(2)}</p>
            )} */}
          </div>
        </div>

        {/* Rating y detalles */}
        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-600">
          <StarRating averageRating={product?.average_rating} reviewCount={product?.review_count} />
          {/* Ejemplo de detalles, puedes personalizar estos */}
          {/* <span>32 total hours</span>
          <span>&bull;</span>
          <span>All Levels</span> */}
        </div>

        {/* Acciones */}
        <div className="mt-2 flex gap-4 text-sm font-medium">
          <button
            onClick={onRemove}
            disabled={loadingRemoveFromCart}
            className="text-indigo-600 hover:underline"
          >
            {loadingRemoveFromCart ? <LoadingMoon /> : "Remove"}
          </button>
          <button onClick={onSaveForLater} className="text-indigo-600 hover:underline">
            {moveActionText}
          </button>
        </div>
      </div>
    </div>
  );
}

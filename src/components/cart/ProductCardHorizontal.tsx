import Image from "next/image";
import Link from "next/link";
import IProduct from "@/interfaces/products/IProduct";
import ISize from "@/interfaces/products/ISize";
import IWeight from "@/interfaces/products/IWeight";
import IMaterial from "@/interfaces/products/IMaterial";
import IColor from "@/interfaces/products/IColor";
import IFlavor from "@/interfaces/products/IFlavor";
import useProductCard from "@/hooks/cart/useProductCard";
import LoadingMoon from "../loaders/LoadingMoon";

interface ComponentProps {
  wishlistItemId?: string | null;
  cartItemId?: string | null;
  index: number;
  product: IProduct | null;
  count: number;
  size?: ISize | null;
  weight?: IWeight | null;
  material?: IMaterial | null;
  color?: IColor | null;
  flavor?: IFlavor | null;
  isWishlist?: boolean;
}

export default function ProductCardHorizontal({
  wishlistItemId = null,
  cartItemId = null,
  index,
  product,
  count,
  size = null,
  weight = null,
  material = null,
  color = null,
  flavor = null,
  isWishlist = false,
}: ComponentProps) {
  const {
    truncatedTitle,
    truncatedTitleMobile,
    originalPrice,
    salePrice,
    isDiscountActive,
    loadingPrice,
    loadingRemove,
    loadingUpdate,
    loadingMove,
    maxCount,
    onRemove,
    onUpdateCount,
    onMove,
  } = useProductCard({
    wishlistItemId,
    cartItemId,
    index,
    product: product!,
    count,
    size,
    weight,
    material,
    color,
    flavor,
    isWishlist,
  });

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
            quality={90}
            className="rounded object-cover"
          />
        )}
      </div>

      {/* Contenido */}
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          {/* Título */}
          <h2 className="text-base font-bold text-gray-900 md:max-w-[60%]">
            <Link href={`/store/${product?.slug}`}>
              <div className="hover:underline">
                <span className="hidden md:inline">{truncatedTitle}</span>
                <span className="inline md:hidden">{truncatedTitleMobile}</span>
              </div>
            </Link>
          </h2>

          {/* Cantidad y precios */}
          <div className="flex items-center space-x-4">
            <select
              id={`quantity-${product?.id}`}
              className="rounded border p-1"
              value={count}
              onChange={e => onUpdateCount(Number(e.target.value))}
              disabled={loadingUpdate}
            >
              {Array.from({ length: maxCount }, (_, i) => i + 1).map(n => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>

            {/* Mientras carga precio */}
            {loadingPrice ? (
              <LoadingMoon />
            ) : isDiscountActive && originalPrice != null && salePrice < originalPrice ? (
              <div className="flex items-center space-x-4">
                <p className="text-sm tracking-tight text-gray-500 line-through">
                  ${originalPrice.toFixed(2)}
                </p>
                <p className="text-xs tracking-tight text-gray-900">${salePrice.toFixed(2)}</p>
                <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-600/10 ring-inset">
                  {Math.round(((originalPrice - salePrice) / originalPrice) * 100)}% off
                </span>
              </div>
            ) : (
              /* **SIN** “Precio anterior” cuando no hay descuento */
              <p className="text-sm tracking-tight text-gray-900">${salePrice.toFixed(2)}</p>
            )}
          </div>
        </div>

        {/* Atributos */}
        <div className="flex flex-wrap gap-2">
          {[size, weight, material, color, flavor]
            .filter((v): v is { title: string } => !!v)
            .map((v, idx) => (
              <span
                key={idx}
                className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-500/10 ring-inset"
              >
                {v.title}
              </span>
            ))}
        </div>

        {/* Botones */}
        <div className="mt-2 flex gap-4 text-sm font-medium">
          <button
            type="button"
            disabled={loadingRemove}
            onClick={onRemove}
            className="text-indigo-600 hover:underline"
          >
            {loadingRemove ? <LoadingMoon /> : "Remove"}
          </button>
          <button
            type="button"
            disabled={loadingMove}
            onClick={onMove}
            className="text-indigo-600 hover:underline"
          >
            {loadingMove ? <LoadingMoon /> : isWishlist ? "Move to cart" : "Save for later"}
          </button>
        </div>
      </div>
    </div>
  );
}

ProductCardHorizontal.defaultProps = {
  size: null,
  weight: null,
  material: null,
  color: null,
  flavor: null,
  isWishlist: false,
  cartItemId: null,
  wishlistItemId: null,
};

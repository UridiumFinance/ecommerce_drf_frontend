import useProductPrice from "@/hooks/useProductPrice";
import IColor from "@/interfaces/products/IColor";
import IFlavor from "@/interfaces/products/IFlavor";
import IMaterial from "@/interfaces/products/IMaterial";
import { IProductList } from "@/interfaces/products/IProduct";
import ISize from "@/interfaces/products/ISize";
import IWeight from "@/interfaces/products/IWeight";
import Image from "next/image";
import Link from "next/link";
import LoadingMoon from "../loaders/LoadingMoon";

interface ComponentProps {
  product: IProductList;
  weight?: IWeight;
  color?: IColor;
  size?: ISize;
  flavor?: IFlavor;
  material?: IMaterial;
}

export default function ProductCartItem({
  product,
  weight,
  color,
  size,
  flavor,
  material,
}: ComponentProps) {
  const {
    originalPrice,
    salePrice,
    isDiscountActive,
    loading: loadingPrice,
  } = useProductPrice({
    slug: product?.slug,
    colorId: color?.id,
    sizeId: size?.id,
    materialId: material?.id,
    weightId: weight?.id,
    flavorId: flavor?.id,
  });

  return (
    <div className="flex max-w-md items-start space-x-4">
      {/* Imagen más pequeña */}
      <div className="flex-shrink-0">
        <Image
          width={64}
          height={64}
          src={product?.thumbnail}
          alt={product?.title}
          className="h-16 w-16 rounded-md object-cover"
        />
      </div>

      {/* Contenido */}
      <div className="flex flex-1 flex-col">
        {/* Título y precio */}
        <div>
          <Link href={`/store/${product?.slug}`} className="line-clamp-2 block text-sm font-bold">
            {product?.title}
          </Link>

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
    </div>
  );
}

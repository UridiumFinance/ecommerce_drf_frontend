import useProductPrice from "@/hooks/useProductPrice";
import IColor from "@/interfaces/products/IColor";
import IFlavor from "@/interfaces/products/IFlavor";
import IMaterial from "@/interfaces/products/IMaterial";
import { IProductList } from "@/interfaces/products/IProduct";
import ISize from "@/interfaces/products/ISize";
import IWeight from "@/interfaces/products/IWeight";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
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
  const { basePrice, discountPrice } = useProductPrice({
    slug: product?.slug,
    colorId: color?.id,
    sizeId: size?.id,
    materialId: material?.id,
    weightId: weight?.id,
    flavorId: flavor?.id,
  });

  const isDiscountActive = useMemo(() => {
    if (!product?.discount || !product.discount_until) return false;
    const now = new Date();
    const until = new Date(product.discount_until);
    return until > now;
  }, [product?.discount, product?.discount_until]);

  // Mostramos descuento sólo si el API nos devolvió un discountPrice menor
  const showDiscount = isDiscountActive && discountPrice < basePrice;

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

          {showDiscount ? (
            <div className="mt-1 flex items-center space-x-2 text-sm">
              <p className="text-gray-500 line-through">$ {basePrice.toFixed(2)}</p>
              <p className="font-semibold text-gray-900">$ {discountPrice.toFixed(2)}</p>
              <span className="inline-flex items-center rounded bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700 ring-1 ring-red-600/10">
                {Math.round(((basePrice - discountPrice) / basePrice) * 100)}% off
              </span>
            </div>
          ) : (
            <p className="mt-1 text-sm font-semibold text-gray-900">$ {basePrice.toFixed(2)}</p>
          )}
        </div>

        {/* Botones justo debajo y anclados abajo */}
        <div className="mt-auto flex space-x-4 text-xs">
          <button className="text-indigo-600 hover:underline">Remove</button>
          <button className="text-indigo-600 hover:underline">Save for later</button>
        </div>
      </div>
    </div>
  );
}

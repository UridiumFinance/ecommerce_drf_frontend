import useProductPrice from "@/hooks/useProductPrice";
import { CartItem } from "@/redux/actions/cart/interfaces";
import Image from "next/image";
import LoadingMoon from "../loaders/LoadingMoon";

interface Props {
  ci: CartItem;
}

export default function CheckoutItem({ ci }: Props) {
  const {
    originalPrice,
    salePrice,
    isDiscountActive,
    loading: loadingPrice,
  } = useProductPrice({
    slug: ci?.item.slug,
    colorId: ci?.color?.id,
    sizeId: ci?.size?.id,
    materialId: ci?.material?.id,
    weightId: ci?.weight?.id,
    flavorId: ci?.flavor?.id,
  });

  return (
    <li key={ci.id} className="flex items-start space-x-4 py-6">
      <Image
        priority
        width={512}
        height={512}
        alt=""
        src={ci.item?.thumbnail || ""}
        className="size-20 flex-none rounded-md object-cover"
      />
      <div className="flex-auto space-y-1">
        <h3>{ci.item?.title}</h3>
        {ci.color && <p className="text-gray-500">{ci.color.title}</p>}
        {ci.size && <p className="text-gray-500">{ci.size.title}</p>}
        {ci.weight && <p className="text-gray-500">{ci.weight.title}</p>}
        {ci.flavor && <p className="text-gray-500">{ci.flavor.title}</p>}
        {ci.material && <p className="text-gray-500">{ci.material.title}</p>}
      </div>
      <div className="flex-none text-base font-medium">
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
    </li>
  );
}

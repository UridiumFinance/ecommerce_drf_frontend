import LoadingMoon from "@/components/loaders/LoadingMoon";
import { ToastError } from "@/components/toast/alerts";
import { IProductList } from "@/interfaces/products/IProduct";
import { addToCart, addToCartAnonymous } from "@/redux/actions/cart/actions";
import { AddToCartProps } from "@/redux/actions/cart/interfaces";
import { RootState } from "@/redux/reducers";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UnknownAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

interface ComponentProps {
  product: IProductList;
}

export default function ProductCard({ product }: ComponentProps) {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const dispatch: ThunkDispatch<any, any, UnknownAction> = useDispatch();

  // Helper para elegir el atributo más barato y en stock
  const pickCheapest = <T extends { id: string; price: number; stock: number }>(
    arr?: T[],
  ): string | null => {
    if (!arr?.length) return null;
    // Sólo las que tengan stock > 0
    const available = arr.filter(a => a.stock > 0);
    if (!available.length) return null;
    // Ordenar por precio ascendente
    available.sort((a, b) => a.price - b.price);
    return available[0].id;
  };

  const [loadingAddToCart, setLoadingAddToCart] = useState<boolean>(false);
  const handleAddToCart = async () => {
    // 1) IDs de la variante más barata
    const colorId = pickCheapest(product?.colors);
    const sizeId = pickCheapest(product?.sizes);
    const materialId = pickCheapest(product?.materials);
    const weightId = pickCheapest(product?.weights);
    const flavorId = pickCheapest(product?.flavors);

    // 2) Validar que si existe lista, haya stock
    const checks: [string, any[] | undefined, string | null][] = [
      ["color", product?.colors, colorId],
      ["size", product?.sizes, sizeId],
      ["material", product?.materials, materialId],
      ["weight", product?.weights, weightId],
      ["flavor", product?.flavors, flavorId],
    ];

    for (const [name, list, id] of checks) {
      if (list?.length && id === null) {
        ToastError(`Lo siento, no hay unidades disponibles de la variante más barata de ${name}.`);
        return;
      }
    }

    // 3) Si no hay variante alguna, compruebo stock general
    if (
      !(
        product?.colors?.length ||
        product?.sizes?.length ||
        product?.materials?.length ||
        product?.weights?.length ||
        product?.flavors?.length
      ) &&
      (product?.stock ?? 0) < 1
    ) {
      ToastError("Lo siento, este producto está agotado.");
      return;
    }

    // 4) Construir payload sin campos undefined/null
    const body: Record<string, unknown> = {
      content_type: "product",
      object_id: product!.id,
      count: 1,
      item: product,
    };
    if (colorId) body.color_id = colorId;
    if (sizeId) body.size_id = sizeId;
    if (materialId) body.material_id = materialId;
    if (weightId) body.weight_id = weightId;
    if (flavorId) body.flavor_id = flavorId;
    // coupon_code también podrías añadirlo aquí si lo tienes

    const addToCartData = body as AddToCartProps;

    // 5) Disparar la acción adecuada
    try {
      setLoadingAddToCart(true);
      if (isAuthenticated) {
        await dispatch(addToCart(addToCartData));
      } else {
        await dispatch(addToCartAnonymous(addToCartData));
      }
    } catch (e) {
      ToastError(`Error adding to cart: ${e}`);
    } finally {
      setLoadingAddToCart(false);
    }
  };

  return (
    <div>
      <div className="relative">
        <div className="relative h-72 w-full overflow-hidden rounded-lg">
          <Image
            width={512}
            height={512}
            alt={product?.title}
            src={product?.thumbnail}
            className="size-full object-cover"
          />
        </div>
        <div className="relative mt-4">
          <Link href={`/store/${product?.slug}`} className="text-sm font-medium text-gray-900">
            {product?.title}
          </Link>
          <p className="mt-1 text-sm text-gray-500">{product?.short_description}</p>
        </div>
        <div className="absolute inset-x-0 top-0 flex h-72 items-end justify-end overflow-hidden rounded-lg p-4">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50"
          />
          <p className="relative text-lg font-semibold text-white">$ {product?.min_price}</p>
        </div>
      </div>
      <div className="mt-6">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={loadingAddToCart}
          className="relative flex w-full items-center justify-center rounded-md border border-transparent bg-gray-100 px-8 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
        >
          {loadingAddToCart ? (
            <LoadingMoon />
          ) : (
            <>
              Add to cart<span className="sr-only">, {product?.title}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

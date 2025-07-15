import { ToastError } from "@/components/toast/alerts";
import { RootState } from "@/redux/reducers";
import fetchCartTotal from "@/utils/api/cart/cart_total";
import { CartTotalResponse, CartItemProps } from "@/redux/actions/cart/interfaces";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface Props {
  couponCode?: string;
}

export default function useCartTotal({ couponCode = "" }: Props) {
  // 1) Extraemos items y (opc) coupon del store
  const cartItems = useSelector((state: RootState) => state.cart.items);

  // 2) Estado local para loading y resultado
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState<CartTotalResponse | null>(null);

  // 3) Función que arma el payload y llama a la API
  const getCartTotal = useCallback(async () => {
    if (cartItems.length === 0) {
      setTotal(null);
      return;
    }

    // Mapear tu estado de cartItems al shape que espera el backend
    const items: CartItemProps[] = cartItems.map(ci => ({
      content_type: ci.content_type,
      item_id: ci.object_id || ci?.item?.id,
      count: ci.count,
      size_id: ci.size?.id ?? undefined,
      weight_id: ci.weight?.id ?? undefined,
      material_id: ci.material?.id ?? undefined,
      color_id: ci.color?.id ?? undefined,
      flavor_id: ci.flavor?.id ?? undefined,
    }));

    try {
      setLoading(true);

      const payload = {
        items,
        ...(couponCode ? { coupon_code: couponCode } : {}),
      };

      const response = await fetchCartTotal(payload);
      setTotal(response);
    } catch (err: any) {
      ToastError(`Error calculando total del carrito: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  }, [cartItems, couponCode]);

  useEffect(() => {
    getCartTotal();
  }, [getCartTotal]);

  return { getCartTotal, loading, total };
}

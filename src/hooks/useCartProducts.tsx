import { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/reducers";
import { IProductList } from "@/interfaces/products/IProduct";
import fetchCartProducts from "@/utils/api/cart/products/list";

export default function useCartProducts() {
  // 1) Traigo todos los items del carrito desde Redux
  const cartItems = useSelector((state: RootState) => state.cart.items);

  // 2) Filtrar sólo los de tipo "product"
  const productItems = useMemo(
    () => cartItems.filter(item => item.item_type === "product"),
    [cartItems],
  );

  // 3) Estado local para loading y resultados (incluye cartItemId)
  const [loading, setLoading] = useState(false);
  const [cartProducts, setCartProducts] = useState<(IProductList & { cartItemId: number })[]>([]);

  // 4) Función de carga memoizada
  const load = useCallback(async () => {
    if (productItems.length === 0) {
      setCartProducts([]);
      return;
    }

    setLoading(true);
    try {
      // Arrays paralelos
      const productIds = productItems.map(i => i.item_id);
      const cartItemIds = productItems.map(i => i.cart_item_id);
      const color_id = productItems.map(i => i.color);
      const size_id = productItems.map(i => i.size);
      const material_id = productItems.map(i => i.material);
      const weight_id = productItems.map(i => i.weight);
      const flavor_id = productItems.map(i => i.flavor);
      const count = productItems.map(i => i.count);

      // Llamada al API
      const res = await fetchCartProducts({
        product_ids: productIds,
        color_id,
        size_id,
        material_id,
        weight_id,
        flavor_id,
        count,
      });

      if (res.status === 200) {
        // Merge cartItemId localmente en cada resultado
        const withCartId = res.results.map((prod, idx) => ({
          ...prod,
          cartItemId: cartItemIds[idx],
        }));
        setCartProducts(withCartId);
      } else {
        console.warn("[useCartProducts] status:", res.status);
        setCartProducts([]);
      }
    } catch (err) {
      console.error("[useCartProducts] error:", err);
      setCartProducts([]);
    } finally {
      setLoading(false);
    }
  }, [productItems]);

  // 5) Efecto: disparar fetch cada vez que cambian los productItems
  useEffect(() => {
    load();
  }, [load]);

  return {
    loading,
    cartProducts,
    refresh: load,
  };
}

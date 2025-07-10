import { IProductList } from "@/interfaces/products/IProduct";
import { RootState } from "@/redux/reducers";
import fetchCartProducts from "@/utils/api/cart/products/list";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

export default function useWishlistProducts() {
  // 1) Traigo todos los items del carrito desde Redux
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  // 2) Estado local para loading y resultados
  const [loadingProducts, setLoadingProducts] = useState<boolean>(false);
  const [products, setProducts] = useState<IProductList[]>([]);

  // 3) Memos: filtrar sólo los de tipo "product"
  const productItems = useMemo(
    () => wishlistItems.filter(item => item.item_type === "product"),
    [wishlistItems],
  );

  // 4) Callback para hacer el fetch
  const listProducts = useCallback(async () => {
    if (productItems.length === 0) {
      setProducts([]);
      return;
    }

    try {
      setLoadingProducts(true);
      // extraigo sólo los IDs
      const productIds = productItems.map(i => i.item_id);
      const colorId = productItems.map(i => i.color);
      const sizeId = productItems.map(i => i.size);
      const materialId = productItems.map(i => i.material);
      const weightId = productItems.map(i => i.weight);
      const flavorId = productItems.map(i => i.flavor);
      const count = productItems.map(i => i.count);

      const res = await fetchCartProducts({
        product_ids: productIds,
        color_id: colorId,
        size_id: sizeId,
        material_id: materialId,
        weight_id: weightId,
        flavor_id: flavorId,
        count,
      });

      if (res.status === 200) {
        setProducts(res.results);
      }
    } catch (error) {
      console.error("Error fetching cart products:", error);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  }, [productItems]);

  // 5) Efecto para disparar la carga cuando cambian los productItems
  useEffect(() => {
    listProducts();
  }, [listProducts]);

  return {
    loading: loadingProducts,
    products,
    refreshProducts: listProducts,
  };
}

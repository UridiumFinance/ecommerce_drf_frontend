import { useState, useEffect, useCallback } from "react";
import { ToastError } from "@/components/toast/alerts";
import fetchProductPrice, { FetchProductPriceProps } from "@/utils/api/products/price";

interface Props {
  slug: string | undefined;
  colorId?: string | null;
  sizeId?: string | null;
  materialId?: string | null;
  weightId?: string | null;
  flavorId?: string | null;
}

interface PriceResult {
  price: number; // precio actual (con o sin descuento)
  compare_price: number; // precio original (siempre viene)
  discount_active: boolean; // si el descuento aún está activo
}

export default function useProductPrice({
  slug,
  colorId,
  sizeId,
  materialId,
  weightId,
  flavorId,
}: Props) {
  const [originalPrice, setOriginalPrice] = useState<number | null>(null);
  const [salePrice, setSalePrice] = useState<number>(0);
  const [isDiscountActive, setIsDiscountActive] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const getPrice = useCallback(async () => {
    if (!slug) return;
    setLoading(true);

    try {
      const params: FetchProductPriceProps = {
        slug,
        color_id: colorId,
        size_id: sizeId,
        material_id: materialId,
        weight_id: weightId,
        flavor_id: flavorId,
      };
      const res = await fetchProductPrice(params);

      if (res.status === 200 && res.results) {
        const data = res.results as PriceResult;
        setOriginalPrice(data.compare_price);
        setSalePrice(data.price);
        setIsDiscountActive(data.discount_active);
      }
    } catch (e) {
      ToastError(`Error fetching product price: ${e}`);
    } finally {
      setLoading(false);
    }
  }, [slug, colorId, sizeId, materialId, weightId, flavorId]);

  useEffect(() => {
    getPrice();
  }, [getPrice]);

  return {
    originalPrice,
    salePrice,
    isDiscountActive,
    loading,
  };
}

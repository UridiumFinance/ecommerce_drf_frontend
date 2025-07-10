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

export default function useProductPrice({
  slug,
  colorId,
  sizeId,
  materialId,
  weightId,
  flavorId,
}: Props) {
  const [basePrice, setBasePrice] = useState<number>(0);
  const [discountPrice, setDiscountPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const getPrice = useCallback(async () => {
    try {
      setLoading(true);

      const fetchProductPriceData: FetchProductPriceProps = {
        slug,
        color_id: colorId,
        size_id: sizeId,
        material_id: materialId,
        weight_id: weightId,
        flavor_id: flavorId,
      };

      const res = await fetchProductPrice(fetchProductPriceData);

      if (res.status === 200) {
        setBasePrice(res.results.compare_price);
        setDiscountPrice(res.results.price);
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

  return { basePrice, discountPrice, loading };
}

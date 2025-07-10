import buildQueryString from "@/utils/buildQueryString";

export interface FetchProductPriceProps {
  slug: string | undefined;
  color_id?: string | null;
  size_id?: string | null;
  material_id?: string | null;
  weight_id?: string | null;
  flavor_id?: string | null;
}

export default async function fetchProductPrice(props: FetchProductPriceProps) {
  try {
    const res = await fetch(`/api/products/getPrice?${buildQueryString(props)}`);
    const data = await res.json();
    if (res.status === 200) {
      return data;
    }

    if (res.status === 404) {
      return data;
    }
  } catch (e) {
    return e;
  }

  return null;
}

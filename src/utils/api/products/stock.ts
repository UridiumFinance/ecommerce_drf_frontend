import buildQueryString from "@/utils/buildQueryString";

export interface FetchProductsProps {
  slug: string;
}

export default async function fetchProductStock(props: FetchProductsProps) {
  try {
    const res = await fetch(`/api/products/getStock?${buildQueryString(props)}`);
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

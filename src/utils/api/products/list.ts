import buildQueryString from "@/utils/buildQueryString";

export interface FetchProductsProps {
  p: number;
  page_size: number;
  search?: string;
  sorting?: string;
  ordering?: string;
}

export default async function fetchProducts(props: FetchProductsProps) {
  try {
    const res = await fetch(`/api/products/list?${buildQueryString(props)}`);
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

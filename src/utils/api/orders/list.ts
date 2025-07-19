import buildQueryString from "@/utils/buildQueryString";

export interface FetchOrdersProps {
  p: number;
  page_size: number;
  search?: string;
  ordering?: string;
}

export default async function fetchOrders(props: FetchOrdersProps) {
  try {
    const res = await fetch(`/api/orders/list?${buildQueryString(props)}`);
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

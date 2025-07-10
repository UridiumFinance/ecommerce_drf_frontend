import buildQueryString from "@/utils/buildQueryString";

export interface FetchCartProductsProps {
  product_ids: string[] | undefined;
  // Si tu carrito guarda distintos atributos, los pasas también como arrays
  color_id?: (string | null)[];
  size_id?: (string | null)[];
  material_id?: (string | null)[];
  weight_id?: (string | null)[];
  flavor_id?: (string | null)[];
  count?: number[]; // cantidad de cada item
}

export default async function fetchCartProducts(props: FetchCartProductsProps) {
  try {
    const res = await fetch(`/api/cart/products/list?${buildQueryString(props)}`);
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

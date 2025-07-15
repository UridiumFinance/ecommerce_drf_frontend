import { CartTotalRequest, CartTotalResponse } from "@/redux/actions/cart/interfaces";

export default async function fetchCartTotal(
  payload: CartTotalRequest,
): Promise<CartTotalResponse> {
  const res = await fetch(`/api/cart/calculate_total`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    // Puedes lanzar un error o manejar distintos status aquí
    const errorBody = await res.json();
    throw new Error(`Error ${res.status}: ${errorBody.error || res.statusText}`);
  }

  return res.json();
}

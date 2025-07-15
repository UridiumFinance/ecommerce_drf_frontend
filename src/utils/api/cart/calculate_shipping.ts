export default async function fetchShippingCost() {
  const res = await fetch(`/api/cart/calculate_shipping`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    // Puedes lanzar un error o manejar distintos status aquí
    const errorBody = await res.json();
    throw new Error(`Error ${res.status}: ${errorBody.error || res.statusText}`);
  }

  return res.json();
}

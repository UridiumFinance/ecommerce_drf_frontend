import { ToastError } from "@/components/toast/alerts";

export interface CreateShippingAddressProps {
  label: string;
  street: string;
  apartment: string;
  city: string;
  region: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

export async function createShippingAddress(props: CreateShippingAddressProps) {
  const { label, street, apartment, city, region, postal_code, country, is_default } = props;

  try {
    const res = await fetch("/api/addresses/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        label,
        street,
        apartment,
        city,
        region,
        postal_code,
        country,
        is_default,
      }),
    });

    const data = await res.json();

    if (res.status === 201) {
      return data;
    }
  } catch (err) {
    ToastError(`Error creating address: ${err}`);
  }

  return null;
}

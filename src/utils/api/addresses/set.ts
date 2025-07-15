import { ToastError } from "@/components/toast/alerts";

export interface SetShippingAddressProps {
  shippingAddressId: string;
}

export async function setShippingAddress(props: SetShippingAddressProps) {
  const { shippingAddressId } = props;

  try {
    const res = await fetch("/api/addresses/set_default", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        shippingAddressId,
      }),
    });

    const data = await res.json();

    if (res.status === 200) {
      return data;
    }
  } catch (err) {
    ToastError(`Error creating address: ${err}`);
  }

  return null;
}

import { ToastError } from "@/components/toast/alerts";

export interface ProcessStripePaymentProps {
  method: string;
  data: Record<string, any>;
}

export async function processStripePayment(props: ProcessStripePaymentProps) {
  try {
    const res = await fetch("/api/payments/stripe_payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(props), // ahora enviamos method + data
    });

    const data = await res.json();
    return { status: res.status, ...data };
  } catch (err) {
    ToastError("Error creating stripe payment");
    return null;
  }
}

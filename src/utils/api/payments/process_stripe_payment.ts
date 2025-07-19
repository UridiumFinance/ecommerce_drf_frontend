export interface ProcessStripePaymentProps {
  payment_method_id: string;
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
    return data;
  } catch (err) {
    console.log(`Error creating stripe payment: ${err}`);
    return null;
  }
}

import OrderSummary from "@/components/checkout/OrderSummary";
import SelectPayment, { PaymentPayload } from "@/components/checkout/SelectPayment";
import ShippingAddress from "@/components/checkout/ShippingAddress";
import SEO, { SEOProps } from "@/components/pages/SEO";
import { ToastError, ToastSuccess, ToastWarning } from "@/components/toast/alerts";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { RootState } from "@/redux/reducers";
import fetchShippingCost from "@/utils/api/cart/calculate_shipping";
import { processStripePayment } from "@/utils/api/orders/process_stripe_payment";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

const SEOList: SEOProps = {
  title: "Checkout | SoloPython",
  description:
    "Completa tu pago de cursos y recursos de programación en SoloPython de forma rápida y segura.",
  keywords:
    "checkout, pago, compra, cursos Python, SoloPython, programación en Python, aprendizaje",
  href: "/checkout",
  robots: "noindex, nofollow",
  author: "SoloPython",
  publisher: process.env.DOMAIN_NAME || "solopython.com",
  image: "/assets/img/thumbnails/checkout_thumbnail.jpg",
  twitterHandle: "@solopython",
};

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

export default function Page() {
  const stripe = useStripe();
  const elements = useElements();
  const [method, setMethod] = useState<"creditCard" | "paypal" | "mercadoPago">("creditCard");

  const router = useRouter();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, router]);

  const [paymentInfo, setPaymentInfo] = useState<PaymentPayload>({
    method: "creditCard",
    data: {},
  });

  const [shippingCost, setShippingCost] = useState<string>("0");
  const [loadingShippingCost, setLoadingShippingCost] = useState<boolean>(false);
  const getShippingCost = useCallback(async () => {
    try {
      setLoadingShippingCost(true);
      const res = await fetchShippingCost();
      if (res.status === 200) {
        setShippingCost(res.results.shipping_cost);
      }
    } catch (err) {
      ToastWarning(`You must have a valid shipping address`);
    } finally {
      setLoadingShippingCost(false);
    }
  }, []);

  useEffect(() => {
    getShippingCost();
  }, [getShippingCost]);

  const [loadingPayment, setLoadingPayment] = useState<boolean>(false);
  const handleProcessStripePayment = async () => {
    if (!stripe || !elements) return;
    setLoadingPayment(true);

    try {
      let paymentMethodId: string;

      if (method === "creditCard") {
        const cardEl = elements.getElement(CardElement)!;
        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: "card",
          card: cardEl,
        });
        if (error) {
          ToastError(error.message || "Error creating payment method");
          setLoadingPayment(false);
          return;
        }
        paymentMethodId = paymentMethod!.id;
      } else {
        // Lógica para otros métodos…
        return;
      }

      // Envío al backend
      const res = await fetch("/api/payments/stripe_payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMethodId }),
      });
      const json = await res.json();

      if (json.status === "requires_action") {
        // 3DS / autenticación adicional
        const { error: confirmError } = await stripe.confirmCardPayment(json.client_secret);
        if (confirmError) {
          ToastError(confirmError.message || "Authentication failed");
        } else {
          ToastSuccess("Payment complete 🎉");
          // redirigir o lo que necesites…
        }
      } else if (json.status === "succeeded") {
        ToastSuccess("Payment complete 🎉");
      } else {
        ToastError("Payment failed");
      }
    } catch (err) {
      ToastError(`Error processing payment: ${err}`);
    } finally {
      setLoadingPayment(false);
    }
  };

  const [addresses, setAddresses] = useState<any[]>([]);
  const hasAddress = addresses.length > 0;

  const { cardNumber, expiryMonth, expiryYear, cvc } = paymentInfo.data as {
    cardNumber?: string;
    expiryMonth?: string;
    expiryYear?: string;
    cvc?: string;
  };

  const expiryDate = expiryMonth && expiryYear ? `${expiryMonth}/${expiryYear}` : "";

  const isPaymentDataComplete =
    Boolean(cardNumber?.trim()) &&
    Boolean(expiryMonth?.trim()) &&
    Boolean(expiryYear?.trim()) &&
    Boolean(cvc?.trim());

  const canPay = hasAddress && isPaymentDataComplete;

  return (
    <div>
      <SEO {...SEOList} />
      <div className="bg-white">
        {/* Background color split screen for large screens */}
        <div
          aria-hidden="true"
          className="fixed top-0 left-0 hidden h-full w-1/2 bg-white lg:block"
        />
        <div
          aria-hidden="true"
          className="fixed top-0 right-0 hidden h-full w-1/2 bg-gray-50 lg:block"
        />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8 xl:gap-x-48">
          <h1 className="sr-only">Order information</h1>

          <OrderSummary shippingCost={shippingCost} />

          <div className="px-4 pt-16 pb-36 sm:px-6 lg:col-start-1 lg:row-start-1 lg:px-0 lg:pb-16">
            <div className="mx-auto max-w-lg lg:max-w-none">
              <SelectPayment method={method} onMethodChange={setMethod} />

              <ShippingAddress onAddressesChange={setAddresses} />

              <div className="mt-10 border-t border-gray-200 pt-6 sm:flex sm:items-center sm:justify-between">
                <button
                  type="button"
                  disabled={!canPay || loadingPayment}
                  onClick={handleProcessStripePayment}
                  className={`w-full rounded-md px-4 py-2 text-sm font-medium shadow-sm sm:order-last sm:ml-6 sm:w-auto ${
                    canPay && !loadingPayment
                      ? "border border-transparent bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 focus:outline-none"
                      : "border border-gray-300 bg-gray-200 text-gray-500"
                  } `}
                >
                  Pay now
                </button>
                <div />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

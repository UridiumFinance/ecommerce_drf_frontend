import OrderSummary from "@/components/checkout/OrderSummary";
import SelectPayment from "@/components/checkout/SelectPayment";
import ShippingAddress from "@/components/checkout/ShippingAddress";
import SEO, { SEOProps } from "@/components/pages/SEO";
import { ToastError, ToastSuccess, ToastWarning } from "@/components/toast/alerts";
import { RootState } from "@/redux/reducers";
import fetchShippingCost from "@/utils/api/cart/calculate_shipping";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import {
  processStripePayment,
  ProcessStripePaymentProps,
} from "@/utils/api/payments/process_stripe_payment";
import LoadingMoon from "@/components/loaders/LoadingMoon";
import { ThunkDispatch } from "redux-thunk";
import { UnknownAction } from "redux";
import { clearCart } from "@/redux/actions/cart/actions";

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

const paymentMethods = [
  { id: "creditCard", title: "Credit Card", disabled: false },
  { id: "paypal", title: "Paypal", disabled: true },
  { id: "mercadoPago", title: "Mercado Pago", disabled: true },
];

function CreditCardForm({
  onChange,
  errorMessage,
}: {
  onChange: (e: any) => void;
  errorMessage: string | null;
}) {
  return (
    <form className="mx-auto max-w-md">
      <div className="mb-4">
        <div className="text-sm font-medium text-gray-700">Número de tarjeta</div>
        <div id="card-number" className="mt-1 rounded-md border border-gray-300 p-2">
          <CardNumberElement
            options={{ style: { base: { fontSize: "16px" } } }}
            onChange={onChange}
          />
        </div>
      </div>

      <div className="mb-4 flex gap-4">
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-700">Expiración</div>
          <div id="card-expiry" className="mt-1 rounded-md border border-gray-300 p-2">
            <CardExpiryElement
              options={{ style: { base: { fontSize: "16px" } } }}
              onChange={onChange}
            />
          </div>
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-700">CVC</div>
          <div id="card-cvc" className="mt-1 rounded-md border border-gray-300 p-2">
            <CardCvcElement
              options={{ style: { base: { fontSize: "16px" } } }}
              onChange={onChange}
            />
          </div>
        </div>
      </div>

      {errorMessage && <div className="mb-4 text-sm text-red-500">{errorMessage}</div>}
    </form>
  );
}

function PaypalForm() {
  return <div>paypal form</div>;
}

function MercadoPagoForm() {
  return <div>paypal form</div>;
}

export default function Page() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);

  // Shipping cost (igual que antes)...
  const [shippingCost, setShippingCost] = useState("0");
  const [loadingShippingCost, setLoadingShippingCost] = useState(false);
  const getShippingCost = useCallback(async () => {
    try {
      setLoadingShippingCost(true);
      const res = await fetchShippingCost();
      if (res.status === 200) setShippingCost(res.results.shipping_cost);
    } catch {
      ToastWarning("Necesitas una dirección válida");
    } finally {
      setLoadingShippingCost(false);
    }
  }, []);
  useEffect(() => {
    getShippingCost();
  }, [getShippingCost]);

  // Direcciones
  const [addresses, setAddresses] = useState<any[]>([]);
  const hasAddress = addresses.length > 0;

  // Validación de campos de tarjeta
  const [cardError, setCardError] = useState<string | null>(null);
  const [cardNumberComplete, setCardNumberComplete] = useState(false);
  const [cardExpiryComplete, setCardExpiryComplete] = useState(false);
  const [cardCvcComplete, setCardCvcComplete] = useState(false);

  const handleCardChange = (e: any) => {
    // Actualiza mensaje de error
    setCardError(e.error ? e.error.message : null);

    // Marca completitud según tipo de campo
    switch (e.elementType) {
      case "cardNumber":
        setCardNumberComplete(e.complete);
        break;
      case "cardExpiry":
        setCardExpiryComplete(e.complete);
        break;
      case "cardCvc":
        setCardCvcComplete(e.complete);
        break;
      default:
        break;
    }
  };

  // Estado de carga y método seleccionado
  const [selectedMethod, setSelectedMethod] = useState(paymentMethods[0].id);

  // Redirigir si no está logueado
  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, router]);

  // Sólo permitimos pagar si:
  // 1) hay dirección y
  // 2) todos los campos de tarjeta están completos
  const canPay =
    selectedMethod === "creditCard" &&
    hasAddress &&
    cardNumberComplete &&
    cardExpiryComplete &&
    cardCvcComplete;

  // 3) Envío al backend
  const [loadingPayment, setLoadingPayment] = useState(false);

  const dispatch: ThunkDispatch<any, any, UnknownAction> = useDispatch();
  const handleProcessStripePayment = async () => {
    if (!stripe || !elements) return;
    setCardError(null);

    try {
      setLoadingPayment(true);

      // 1) Crear PaymentMethod
      const cardEl = elements.getElement(CardNumberElement)!;
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardEl,
      });

      if (error) {
        setCardError(error.message!);
        setLoadingPayment(false);
        return;
      }

      // 2) Armar payload con tarjeta + dirección
      const payload: ProcessStripePaymentProps = {
        payment_method_id: paymentMethod!.id,
      };

      // 3) Llamar a tu API
      const res = await processStripePayment(payload);
      if (!res.success) {
        setCardError(res.error || "Error procesando el pago");
      } else {
        // éxito: redirige, muestra toast...
        await dispatch(clearCart());
        ToastSuccess("✅ Payment complete");
        router.push("/profile/orders");
      }
    } catch (err) {
      ToastError(`Error creating payment: ${err}`);
    } finally {
      setLoadingPayment(false);
    }
  };

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
              <SelectPayment
                method={selectedMethod}
                onMethodChange={setSelectedMethod}
                paymentMethods={paymentMethods}
              />
              <div className="mt-8">
                {selectedMethod === "creditCard" && (
                  <CreditCardForm onChange={handleCardChange} errorMessage={cardError} />
                )}
                {selectedMethod === "paypal" && <PaypalForm />}
                {selectedMethod === "mercadoPago" && <MercadoPagoForm />}
              </div>

              <ShippingAddress onAddressesChange={setAddresses} />

              <div className="mt-10 border-t border-gray-200 pt-6 sm:flex sm:items-center sm:justify-between">
                <p className="mt-4 text-center text-sm text-gray-500 sm:mt-0 sm:text-left">
                  You won't be charged until the next step.
                </p>
                <button
                  type="button"
                  disabled={!canPay || loadingPayment}
                  onClick={handleProcessStripePayment}
                  className={`w-full rounded-md px-4 py-2 text-sm font-medium shadow-sm sm:ml-6 sm:w-auto ${
                    canPay && !loadingPayment
                      ? "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {loadingPayment ? <LoadingMoon /> : "Pay now"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

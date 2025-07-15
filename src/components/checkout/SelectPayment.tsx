import React from "react";
import { CardElement } from "@stripe/react-stripe-js";

export interface SelectPaymentProps {
  method: string;
  onMethodChange: (method: string) => void;
  onCardChange?: (complete: boolean) => void;
}

const paymentMethods = [
  { id: "creditCard", title: "Credit Card", disabled: false },
  { id: "paypal", title: "Paypal", disabled: true },
  { id: "mercadoPago", title: "Mercado Pago", disabled: true },
];

export default function SelectPayment({
  method,
  onMethodChange,
  onCardChange,
}: SelectPaymentProps) {
  return (
    <section aria-labelledby="payment-heading">
      <h2 id="payment-heading" className="text-lg font-medium text-gray-900">
        Payment details
      </h2>

      {/* 1) Selector de método */}
      <fieldset>
        <legend className="sr-only">Selecciona método de pago</legend>
        <div className="mt-6 flex space-x-10">
          {paymentMethods.map(m => (
            <label key={m.id} className="inline-flex items-center">
              <input
                type="radio"
                name="payment-method"
                value={m.id}
                checked={method === m.id}
                onChange={() => onMethodChange(m.id)}
                disabled={m.disabled}
                className="size-4 rounded-full border border-gray-300 checked:bg-indigo-600"
              />
              <span className="ml-2 text-sm font-medium text-gray-900">{m.title}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* 2) Si eligió tarjeta, montamos el CardElement */}
      {method === "creditCard" && (
        <div className="mt-8">
          <label className="mb-1 block text-sm font-medium text-gray-700">Card details</label>
          <div className="rounded-md border border-gray-300 bg-white px-3 py-2">
            <CardElement
              options={{ hidePostalCode: true }}
              onChange={e => onCardChange?.(e.complete)}
            />
          </div>
        </div>
      )}
    </section>
  );
}

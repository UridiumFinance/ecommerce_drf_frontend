export interface PaymentMethod {
  id: string;
  title: string;
  disabled: boolean;
}

export interface SelectPaymentProps {
  /** id del método actualmente seleccionado */
  method: string;
  /** callback para notificar al padre el cambio de método */
  onMethodChange: (method: string) => void;
  /** lista completa de métodos disponibles */
  paymentMethods: PaymentMethod[];
}

export default function SelectPayment({
  method,
  onMethodChange,
  paymentMethods,
}: SelectPaymentProps) {
  return (
    <section aria-labelledby="payment-heading">
      <h2 id="payment-heading" className="text-lg font-medium text-gray-900">
        Payment details
      </h2>

      {/* Selector de método */}
      <fieldset>
        <div className="mt-6 space-y-6 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
          {paymentMethods.map(m => (
            <div key={m.id} className="flex items-center">
              <input
                checked={method === m.id}
                name="payment-method"
                type="radio"
                onChange={() => onMethodChange(m.id)}
                disabled={m.disabled}
                className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden"
              />
              <label htmlFor={m.id} className="ml-3 block text-sm/6 font-medium text-gray-900">
                {m.title}
              </label>
            </div>
          ))}
        </div>
      </fieldset>
    </section>
  );
}

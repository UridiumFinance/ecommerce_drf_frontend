import { RootState } from "@/redux/reducers";
import { Popover, PopoverBackdrop, PopoverButton, PopoverPanel } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import { useSelector } from "react-redux";
import useCartTotal from "@/hooks/cart/useCartTotal";
import LoadingMoon from "../loaders/LoadingMoon";
import CheckoutItem from "../cart/CheckoutItem";

export default function OrderSummary({ shippingCost = "0" }: { shippingCost?: string }) {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const { loading: loadingTotal, total } = useCartTotal({});
  const renderValue = (value?: string) => (loadingTotal ? <LoadingMoon /> : `$${value ?? "0.00"}`);
  return (
    <section
      aria-labelledby="summary-heading"
      className="bg-gray-50 px-4 pt-16 pb-10 sm:px-6 lg:col-start-2 lg:row-start-1 lg:bg-transparent lg:px-0 lg:pb-16"
    >
      <div className="mx-auto max-w-lg lg:max-w-none">
        <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
          Order summary
        </h2>

        <ul className="divide-y divide-gray-200 text-sm font-medium text-gray-900">
          {cartItems.map(ci => (
            <CheckoutItem ci={ci} key={ci.id} />
          ))}
        </ul>

        <dl className="hidden space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-gray-900 lg:block">
          <div className="flex items-center justify-between">
            <dt className="text-gray-600">Subtotal before</dt>
            <dd>{renderValue(total?.subtotal_before)}</dd>
          </div>

          <div className="flex items-center justify-between">
            <dt className="text-gray-600">Subtotal after</dt>
            <dd>{renderValue(total?.subtotal_after)}</dd>
          </div>

          <div className="flex items-center justify-between">
            <dt className="text-gray-600">Item discounts</dt>
            <dd>{renderValue(total?.item_discounts)}</dd>
          </div>

          <div className="flex items-center justify-between">
            <dt className="text-gray-600">Global discount</dt>
            <dd>{renderValue(total?.global_discount)}</dd>
          </div>

          <div className="flex items-center justify-between">
            <dt className="text-gray-600">Tax</dt>
            <dd>{renderValue(total?.tax_amount)}</dd>
          </div>

          <div className="flex items-center justify-between">
            <dt className="text-gray-600">Shipping</dt>
            <dd>{renderValue(shippingCost)}</dd>
          </div>

          <div className="flex items-center justify-between border-t border-gray-200 pt-6">
            <dt className="text-base">Total</dt>
            <dd className="text-base">
              {loadingTotal ? (
                <LoadingMoon />
              ) : (
                `$${((Number(total?.total) || 0) + (Number(shippingCost) || 0)).toFixed(2)}`
              )}
            </dd>
          </div>
        </dl>

        <Popover className="fixed inset-x-0 bottom-0 flex flex-col-reverse text-sm font-medium text-gray-900 lg:hidden">
          <div className="relative z-10 border-t border-gray-200 bg-white px-4 sm:px-6">
            <div className="mx-auto max-w-lg">
              <PopoverButton className="flex w-full items-center py-6 font-medium">
                <span className="mr-auto text-base">Total</span>
                <span className="mr-2 text-base">$361.80</span>
                <ChevronUpIcon aria-hidden="true" className="size-5 text-gray-500" />
              </PopoverButton>
            </div>
          </div>

          <PopoverBackdrop
            transition
            className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />
          <PopoverPanel
            transition
            className="relative transform bg-white px-4 py-6 transition duration-300 ease-in-out data-[closed]:translate-y-full sm:px-6"
          >
            <dl className="mx-auto max-w-lg space-y-6">
              <div className="flex items-center justify-between">
                <dt className="text-gray-600">Subtotal</dt>
                <dd>$320.00</dd>
              </div>

              <div className="flex items-center justify-between">
                <dt className="text-gray-600">Shipping</dt>
                <dd>$15.00</dd>
              </div>

              <div className="flex items-center justify-between">
                <dt className="text-gray-600">Taxes</dt>
                <dd>$26.80</dd>
              </div>
            </dl>
          </PopoverPanel>
        </Popover>
      </div>
    </section>
  );
}

OrderSummary.defaultProps = {
  shippingCost: "0",
};

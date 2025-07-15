import Link from "next/link";
import { Button } from "@/components/ui/button";
import LoadingMoon from "@/components/loaders/LoadingMoon";
import useCartTotal from "@/hooks/cart/useCartTotal";

export default function OrderSummary({ isAuthenticated }: { isAuthenticated: boolean }) {
  const { loading: loadingTotal, total } = useCartTotal({});

  // Helper to format or show loader; defaults to "0.00" if undefined
  const renderValue = (value?: string) => (loadingTotal ? <LoadingMoon /> : `$${value ?? "0.00"}`);

  return (
    <div className="lg:col-span-4">
      <div className="rounded-lg p-6 shadow">
        <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>

        {/* Subtotal before item discounts */}
        <div className="mb-2 flex justify-between text-gray-600">
          <span>Subtotal before</span>
          <span>{renderValue(total?.subtotal_before)}</span>
        </div>

        {/* Subtotal after item discounts */}
        <div className="mb-2 flex justify-between text-gray-600">
          <span>Subtotal after</span>
          <span>{renderValue(total?.subtotal_after)}</span>
        </div>

        {/* Item discounts */}
        <div className="mb-2 flex justify-between text-gray-600">
          <span>Item discounts</span>
          <span>{renderValue(total?.item_discounts)}</span>
        </div>

        {/* Global discount (coupon, promotions) */}
        <div className="mb-2 flex justify-between text-gray-600">
          <span>Global discount</span>
          <span>{renderValue(total?.global_discount)}</span>
        </div>

        {/* Tax amount */}
        <div className="mb-2 flex justify-between text-gray-600">
          <span>Tax</span>
          <span>{renderValue(total?.tax_amount)}</span>
        </div>

        {/* Shipping fee */}
        <div className="mb-2 flex justify-between text-gray-600">
          <span>Shipping</span>
          <span>{renderValue(total?.delivery_fee)}</span>
        </div>

        {/* Divider and total */}
        <div className="mt-2 border-t pt-2">
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>{loadingTotal ? <LoadingMoon /> : `$${total?.total ?? "0.00"}`}</span>
          </div>
        </div>

        <Link href={isAuthenticated ? "/checkout" : "/login"}>
          <Button className="mt-4 w-full">Checkout</Button>
        </Link>
      </div>
    </div>
  );
}

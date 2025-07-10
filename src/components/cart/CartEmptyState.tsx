import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function CartEmptyState() {
  return (
    <div className="text-center">
      <ShoppingCartIcon className="mx-auto size-8 text-gray-400" />
      <h3 className="mt-2 text-sm font-semibold text-gray-900">Your cart is empty</h3>
      <p className="mt-1 text-sm text-gray-500">Keep shopping and add producst to your cart</p>
      <div className="mt-6">
        <Link
          href="/store"
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Keep shopping
        </Link>
      </div>
    </div>
  );
}

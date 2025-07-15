"use client";

import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState, useRef } from "react";
import Button from "@/components/Button";
import ProductCartItem from "@/components/cart/ProductCartItem";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/reducers";
import LoadingCartItem from "@/components/loaders/LoadingCartItem";
import Link from "next/link";
import useCartProducts from "@/hooks/useCartProducts";
import CartEmptyState from "@/components/cart/CartEmptyState";

export default function Cart() {
  const [open, setOpen] = useState(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const CLOSE_DELAY = 200;

  const handleMouseEnter = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
    setOpen(true);
  };

  const handleMouseLeave = () => {
    // programamos el cierre con retardo
    closeTimeout.current = setTimeout(() => {
      setOpen(false);
      closeTimeout.current = null;
    }, CLOSE_DELAY);
  };

  // const { loading: loadingProducts, cartProducts } = useCartProducts();

  const cartTotalItems = useSelector((state: RootState) => state.cart.totalItems);
  const cartItems = useSelector((state: RootState) => state.cart.items);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <Link
          href="/cart"
          className="relative inline-block rounded-xl p-3 transition-colors hover:bg-indigo-100"
        >
          <ShoppingCartIcon className="h-5 w-auto" />
          {cartTotalItems > 0 && (
            <span className="absolute top-0 right-0 block size-4 items-center justify-center rounded-full bg-indigo-400 text-center text-xs text-white ring-2 ring-white">
              {cartTotalItems}
            </span>
          )}
        </Link>
      </PopoverTrigger>

      <PopoverContent
        className="w-80"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {cartTotalItems > 0 ? (
          <div className="space-y-4">
            <div className="max-h-[180px] divide-y-2 divide-gray-200 overflow-y-auto">
              {cartItems.map((cartItem, idx) => (
                <div key={idx} className="py-2">
                  <ProductCartItem
                    product={cartItem.item}
                    weight={cartItem?.weight}
                    color={cartItem?.color}
                    size={cartItem?.size}
                    flavor={cartItem?.flavor}
                    material={cartItem?.material}
                  />
                </div>
              ))}
            </div>
            <Link href="/cart">
              <Button className="w-full">Go to cart</Button>
            </Link>
          </div>
        ) : (
          <CartEmptyState />
        )}
      </PopoverContent>
    </Popover>
  );
}

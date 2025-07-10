import Button from "@/components/Button";
import ProductCardHorizontal from "@/components/cart/ProductCardHorizontal";
import LoadingCartItem from "@/components/loaders/LoadingCartItem";
import SEO, { SEOProps } from "@/components/pages/SEO";
import Layout from "@/hocs/Layout";
import useCartProducts from "@/hooks/useCartProducts";
import {
  clearCart,
  clearCartAnonymous,
  moveCartToWishlistAnonymous,
  removeFromCart,
  removeFromCartAnonymous,
  updateCartItem,
  updateCartItemAnonymous,
} from "@/redux/actions/cart/actions";
import { RootState } from "@/redux/reducers";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { UnknownAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import CartEmptyState from "@/components/cart/CartEmptyState";
import useWishlistProducts from "@/hooks/useWishlistProducts";
import {
  moveWishlistToCartAnonymous,
  removeFromWishlistAnonymous,
} from "@/redux/actions/wishlist/actions";
import { useState } from "react";
import { ToastError } from "@/components/toast/alerts";

const SEOList: SEOProps = {
  title: "Tu Carrito de Compras | SoloPython",
  description:
    "Revisa los productos que has agregado a tu carrito y finaliza tu compra de cursos, artículos y recursos sobre Python. ¡Aprende programación hoy mismo!",
  keywords:
    "carrito de compras, cursos de Python, comprar cursos de programación, checkout, SoloPython",
  href: "/cart",
  robots: "noindex, nofollow",
  author: "SoloPython",
  publisher: process.env.DOMAIN_NAME || "solopython.com",
  image: "/assets/img/thumbnails/default_thumbnail.jpg",
  twitterHandle: "@solopython",
};

export default function Page() {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const totalItems = useSelector((state: RootState) => state.cart.totalItems);
  const wishlistTotalItems = useSelector((state: RootState) => state.wishlist.totalItems);
  const subtotal = useSelector((state: RootState) => state.cart.subtotal);
  const taxRate = useSelector((state: RootState) => state.cart.taxRate);
  const taxAmount = useSelector((state: RootState) => state.cart.taxAmount);
  const total = useSelector((state: RootState) => state.cart.total);

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  // const { loading: loadingProducts, cartProducts } = useCartProducts();
  const { loading: loadingWishlistProducts, products: wishlistProducts } = useWishlistProducts();

  const dispatch: ThunkDispatch<any, any, UnknownAction> = useDispatch();

  const [loadingRemoveFromCart, setLoadingRemoveFromCart] = useState<boolean>(false);
  const handleRemoveFromCart = async (product_id: string) => {
    if (isAuthenticated) {
      try {
        setLoadingRemoveFromCart(true);
        await dispatch(
          removeFromCart({
            item_id: product_id,
            item_type: "product",
          }),
        );
      } catch (e) {
        ToastError(`Error removing form cart: ${e}`);
      } finally {
        setLoadingRemoveFromCart(false);
      }
    } else {
      try {
        setLoadingRemoveFromCart(true);
        await dispatch(
          removeFromCartAnonymous({
            item_id: product_id,
            item_type: "product",
          }),
        );
      } catch (e) {
        ToastError(`Error removing form cart: ${e}`);
      } finally {
        setLoadingRemoveFromCart(false);
      }
    }
  };

  const handleRemoveFromWishlist = async (product_id: string) => {
    if (isAuthenticated) {
      console.log("Remove from wishlist backend");
    } else {
      dispatch(
        removeFromWishlistAnonymous({
          item_id: product_id,
          item_type: "product",
        }),
      );
    }
  };

  const handleMoveToWishlist = async (
    product_id: string,
    selectedAttrs: {
      size?: string | null;
      weight?: string | null;
      material?: string | null;
      color?: string | null;
      flavor?: string | null;
    },
  ) => {
    if (isAuthenticated) {
      console.log("Move from cart to wishlist backend");
    } else {
      dispatch(
        moveCartToWishlistAnonymous({
          item_id: product_id,
          item_type: "product",
          // Pasamos todos los atributos
          size: selectedAttrs.size_id ?? null,
          weight: selectedAttrs.weight_id ?? null,
          material: selectedAttrs.material_id ?? null,
          color: selectedAttrs.color_id ?? null,
          flavor: selectedAttrs.flavor_id ?? null,
        }),
      );
    }
  };

  const handleMoveToCart = async (
    product_id: string,
    selectedAttrs: {
      size?: string | null;
      weight?: string | null;
      material?: string | null;
      color?: string | null;
      flavor?: string | null;
    },
  ) => {
    if (isAuthenticated) {
      console.log("Move from wishlist to cart backend");
    } else {
      dispatch(
        moveWishlistToCartAnonymous({
          item_id: product_id,
          item_type: "product",
          // Y aquí también
          size: selectedAttrs.size_id ?? null,
          weight: selectedAttrs.weight_id ?? null,
          material: selectedAttrs.material_id ?? null,
          color: selectedAttrs.color_id ?? null,
          flavor: selectedAttrs.flavor_id ?? null,
        }),
      );
    }
  };

  const handleClearCart = async () => {
    if (isAuthenticated) {
      dispatch(clearCart());
    } else {
      dispatch(clearCartAnonymous());
    }
  };

  const handleUpdateCartItem = async (
    cart_item_id: string,
    product_id: string,
    newCount: number,
    selectedAttrs: {
      size?: string | null;
      weight?: string | null;
      material?: string | null;
      color?: string | null;
      flavor?: string | null;
    },
  ) => {
    if (isAuthenticated) {
      await dispatch(
        updateCartItem({
          cart_item_id,
          count: newCount,
          size: selectedAttrs.size ?? null,
          weight: selectedAttrs.weight ?? null,
          material: selectedAttrs.material ?? null,
          color: selectedAttrs.color ?? null,
          flavor: selectedAttrs.flavor ?? null,
        }),
      );
    } else {
      dispatch(
        updateCartItemAnonymous({
          item_id: product_id,
          item_type: "product",
          count: newCount,
          size: selectedAttrs.size ?? null,
          weight: selectedAttrs.weight ?? null,
          material: selectedAttrs.material ?? null,
          color: selectedAttrs.color ?? null,
          flavor: selectedAttrs.flavor ?? null,
        }),
      );
    }
  };

  return (
    <main className="w-full">
      <SEO {...SEOList} />
      <h1 className="text-5xl font-bold">Shopping Cart</h1>
      <div className="gap-x-8 lg:grid lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="mt-4 border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
            <div className="-mt-2 -ml-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
              <div className="mt-2">
                <h3 className="text-base font-semibold text-gray-900">
                  {totalItems} items in cart
                </h3>
              </div>
              {totalItems > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="text-sm font-medium text-indigo-600 hover:underline">
                      Clear Cart
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro de vaciar el carrito?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción eliminará todos los productos que tienes en el carrito de forma
                        permanente.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleClearCart}>
                        Vaciar carrito
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
          {totalItems > 0 ? (
            // <div className="mt-4 space-y-2">
            //   {loadingProducts ? (
            //     <LoadingCartItem />
            //   ) : (
            //     cartProducts?.map(cartProduct => {
            //       const { id } = cartProduct.product;
            //       const sel = cartProduct.selected;
            //       const count = cartProduct?.count ?? 1;
            //       const maxCount = cartProduct.product.stock;

            //       return (
            //         <ProductCardHorizontal
            //           onRemove={() => handleRemoveFromCart(id)}
            //           loadingRemoveFromCart={loadingRemoveFromCart}
            //           onSaveForLater={() => handleMoveToWishlist(id, sel)}
            //           count={count}
            //           maxCount={maxCount}
            //           onUpdateCount={newCount =>
            //             handleUpdateCartItem(cartProduct?.cartItemId, id, newCount, sel)
            //           }
            //           key={cartProduct?.product?.id}
            //           product={cartProduct?.product}
            //           selectedAttributes={cartProduct.selected}
            //         />
            //       );
            //     })
            //   )}
            // </div>
            <div className="mt-4 space-y-2">
              {cartItems?.map(cartItem => (
                <ProductCardHorizontal key={cartItem?.item?.id} product={cartItem.item}>
                  ITEM
                </ProductCardHorizontal>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-gray-200 p-24">
              <CartEmptyState />
            </div>
          )}
        </div>
        <div className="lg:col-span-4">
          <div className="rounded-lg p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold">Resumen del pedido</h2>

            <div className="mb-2 flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="mb-2 flex justify-between text-gray-600">
              <span>Impuestos ({(taxRate * 100).toFixed(0)}%)</span>
              <span>${taxAmount.toFixed(2)}</span>
            </div>

            <div className="mt-2 flex justify-between border-t pt-2 text-lg font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <Link href={isAuthenticated ? "/checkout" : "/login"}>
              <Button className="mt-4 w-full">Checkout</Button>
            </Link>
          </div>
        </div>
      </div>
      {wishlistTotalItems > 0 && (
        <div>
          <div className="mt-4 border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
            <div className="-mt-2 -ml-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
              <div className="mt-2">
                <h3 className="text-base font-semibold text-gray-900">
                  {wishlistTotalItems} items in wishlist
                </h3>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {loadingWishlistProducts ? (
              <LoadingCartItem />
            ) : (
              wishlistProducts?.map(wishlistProduct => {
                const { id } = wishlistProduct.product;
                const sel = wishlistProduct.selected;
                const cartItem = cartItems.find(
                  wi =>
                    wi.item_id === id &&
                    wi.item_type === "product" &&
                    wi.size === sel.size &&
                    wi.weight === sel.weight &&
                    wi.material === sel.material &&
                    wi.color === sel.color &&
                    wi.flavor === sel.flavor,
                );

                const count = cartItem?.count ?? 1;
                const maxCount = wishlistProduct.product.stock;
                return (
                  <ProductCardHorizontal
                    moveActionText="Move to Cart"
                    count={count}
                    maxCount={maxCount}
                    onRemove={() => handleRemoveFromWishlist(wishlistProduct?.product?.id)}
                    onSaveForLater={() => handleMoveToCart(id, sel)}
                    key={wishlistProduct?.product?.id}
                    product={wishlistProduct?.product}
                    selectedAttributes={wishlistProduct.selected}
                  />
                );
              })
            )}
          </div>
        </div>
      )}
    </main>
  );
}

Page.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

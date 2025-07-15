import ProductCardHorizontal from "@/components/cart/ProductCardHorizontal";
import SEO, { SEOProps } from "@/components/pages/SEO";
import Layout from "@/hocs/Layout";
import { clearCart, clearCartAnonymous, listCart } from "@/redux/actions/cart/actions";
import { RootState } from "@/redux/reducers";
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
import OrderSummary from "@/components/cart/OrderSummary";
import { useCallback, useEffect } from "react";
import { listWishlist } from "@/redux/actions/wishlist/actions";

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

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const dispatch: ThunkDispatch<any, any, UnknownAction> = useDispatch();

  const handleClearCart = async () => {
    if (isAuthenticated) {
      dispatch(clearCart());
    } else {
      dispatch(clearCartAnonymous());
    }
  };

  const fetchWishlist = useCallback(async () => {
    if (isAuthenticated) await dispatch(listWishlist());
  }, [dispatch, isAuthenticated]);

  const fetchCart = useCallback(async () => {
    if (isAuthenticated) await dispatch(listCart());
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
    fetchCart();
  }, [fetchWishlist, fetchCart]);
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
            <div className="mt-4 space-y-2">
              {cartItems?.map((ci, idx) => (
                <ProductCardHorizontal
                  index={idx}
                  key={idx}
                  cartItemId={ci?.id || null}
                  product={ci.item}
                  size={ci.size}
                  weight={ci.weight}
                  material={ci.material}
                  color={ci.color}
                  flavor={ci.flavor}
                  count={ci.count}
                />
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-gray-200 p-24">
              <CartEmptyState />
            </div>
          )}
        </div>
        <OrderSummary isAuthenticated={isAuthenticated} />
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
            {wishlistItems?.map((wi, idx) => (
              <ProductCardHorizontal
                wishlistItemId={wi?.id || null}
                index={idx}
                key={idx}
                product={wi.item}
                size={wi.size}
                weight={wi.weight}
                material={wi.material}
                color={wi.color}
                flavor={wi.flavor}
                count={wi.count}
                isWishlist
              />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

Page.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

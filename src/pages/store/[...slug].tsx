import Layout from "@/hocs/Layout";
import IProduct from "@/interfaces/products/IProduct";
import SEO, { SEOProps } from "@/components/pages/SEO";
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from "next";

import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { HeartIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import ImageGallery from "@/components/ImageGallery";
import Clock from "@/components/timer/Clock";
import StarRating from "@/components/pages/products/StarRating";
import CollapsibleDescription from "@/components/pages/products/CollapsibleDescription";
import ProductStock from "@/components/pages/products/ProductStock";
import IDetail from "@/interfaces/products/IDetail";
import CustomTabs from "@/components/CustomTabs";
import { useEffect, useMemo, useState } from "react";
import Reviews from "@/components/reviews/Reviews";
import IBenefit from "@/interfaces/products/IBenefit";
import IRequisite from "@/interfaces/products/IRequisite";
import ITargetAudience from "@/interfaces/products/ITargetAudience";
import { RootState } from "@/redux/reducers";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, addToCartAnonymous } from "@/redux/actions/cart/actions";
import { ThunkDispatch } from "redux-thunk";
import { UnknownAction } from "redux";
import { addToWishlist, addToWishlistAnonymous } from "@/redux/actions/wishlist/actions";
import AttributeSelector from "@/components/pages/products/AttributeSelector";
import useProductPrice from "@/hooks/useProductPrice";
import { ToastError, ToastWarning } from "@/components/toast/alerts";
import LoadingMoon from "@/components/loaders/LoadingMoon";
import ISize from "@/interfaces/products/ISize";
import IWeight from "@/interfaces/products/IWeight";
import IMaterial from "@/interfaces/products/IMaterial";
import IFlavor from "@/interfaces/products/IFlavor";
import IColor from "@/interfaces/products/IColor";
import { AddToCartAnonymousProps, AddToCartProps } from "@/redux/actions/cart/interfaces";
import LoadingBar from "@/components/loaders/LoadingBar";
import {
  AddToWishlistAnonymousProps,
  AddToWishlistProps,
} from "@/redux/actions/wishlist/interfaces";

export const getServerSideProps: GetServerSideProps<{
  product: IProduct | null;
  stock: number;
}> = async (context: GetServerSidePropsContext) => {
  const { slug } = context.params as { slug: string };
  const { req } = context;
  const accessToken = req.cookies.access;

  const headers: Record<string, string> = {
    Accept: "application/json",
    "API-Key": process.env.BACKEND_API_KEY!,
  };
  if (accessToken) {
    headers.Authorization = `JWT ${accessToken}`;
  }

  let product: IProduct | null = null;
  let stock = 0;

  try {
    // 1) Fetch datos de producto (cacheado)
    const [detailRes, stockRes] = await Promise.all([
      fetch(`${process.env.API_URL}/api/products/detail/?slug=${encodeURIComponent(slug)}`, {
        headers,
      }),
      fetch(`${process.env.API_URL}/api/products/detail/stock/?slug=${encodeURIComponent(slug)}`, {
        headers,
      }),
    ]);

    if (detailRes.ok) {
      const detailJson = await detailRes.json();
      product = detailJson.results;
    } else if (detailRes.status === 404) {
      return { notFound: true };
    }

    if (stockRes.ok) {
      const stockJson = await stockRes.json();
      stock = stockJson.results ?? 0;
    } else {
      console.warn(`Stock fetch failed: ${stockRes.status}`);
    }
  } catch (e) {
    console.error("Error fetching product or stock:", e);
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }

  return {
    props: {
      product,
      stock,
    },
  };
};

export default function Page({
  product,
  stock,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const SEOList: SEOProps = {
    title: `${product?.title}`,
    description: `${product?.short_description}`,
    keywords: `${product?.keywords}`,
    href: `${process.env.DOMAIN}/store/${product?.slug}`,
    robots: "index, follow",
    author: `SoloPython`,
    publisher: `${process.env.DOMAIN_NAME}`,
    image: `${product?.thumbnail ? product?.thumbnail : "/assets/img/thumbnails/default_thumbnail.jpg"}`,
    twitterHandle: "@solopython",
  };

  const benefitsPanel =
    (product?.benefits?.length ?? 0) > 0 ? (
      <ul className="list-inside list-disc space-y-1">
        {product?.benefits.map((benefit: IBenefit) => (
          <li key={benefit.id ?? benefit.title}>{benefit.title}</li>
        ))}
      </ul>
    ) : (
      <p>No hay beneficios para este producto.</p>
    );

  const requisitesPanel =
    (product?.requisites?.length ?? 0) > 0 ? (
      <ul className="list-inside list-disc space-y-1">
        {product?.requisites.map((req: IRequisite) => (
          <li key={req.id ?? req.title}>{req.title}</li>
        ))}
      </ul>
    ) : (
      <p>No hay requisitos para este producto.</p>
    );

  const audiencePanel =
    (product?.target_audience?.length ?? 0) > 0 ? (
      <ul className="list-inside list-disc space-y-1">
        {product?.target_audience.map((aud: ITargetAudience) => (
          <li key={aud.id ?? aud.title}>{aud.title}</li>
        ))}
      </ul>
    ) : (
      <p>No hay público objetivo definido.</p>
    );

  const [selectedSize, setSelectedSize] = useState<ISize | null>(null);
  const [selectedWeight, setSelectedWeight] = useState<IWeight | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<IMaterial | null>(null);
  const [selectedFlavor, setSelectedFlavor] = useState<IFlavor | null>(null);
  const [selectedColor, setSelectedColor] = useState<IColor | null>(null);

  useEffect(() => {
    if (product?.sizes?.length) setSelectedSize(product?.sizes[0]);
    if (product?.weights?.length) setSelectedWeight(product?.weights[0]);
    if (product?.materials?.length) setSelectedMaterial(product?.materials[0]);
    if (product?.flavors?.length) setSelectedFlavor(product?.flavors[0]);
    if (product?.colors?.length) setSelectedColor(product?.colors[0]);
  }, [product]);

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const dispatch: ThunkDispatch<any, any, UnknownAction> = useDispatch();

  const [loadingAddToCart, setLoadingAddToCart] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const handleAddToCart = async () => {
    // 1) Validar variantes: existencia de selección y stock suficiente
    const variantChecks: {
      name: string;
      list: { id: string; stock?: number }[] | undefined;
      selected: { id: string; stock?: number } | null;
    }[] = [
      { name: "color", list: product?.colors, selected: selectedColor },
      { name: "size", list: product?.sizes, selected: selectedSize },
      { name: "material", list: product?.materials, selected: selectedMaterial },
      { name: "weight", list: product?.weights, selected: selectedWeight },
      { name: "flavor", list: product?.flavors, selected: selectedFlavor },
    ];

    for (const { name, list, selected } of variantChecks) {
      if (list?.length) {
        // 1.a) Debe haber una selección
        if (!selected) {
          ToastError(`Por favor, selecciona una variante de ${name}.`);
          return;
        }
        // 1.b) Verificar stock de la variante
        const available = selected.stock ?? 0;
        if (available < quantity) {
          ToastError(`Lo siento, solo quedan ${available} unidades de la variante de ${name}.`);
          return;
        }
      }
    }

    // 2) Si no hay variantes en absoluto, comprobar stock general
    const hasAnyVariants =
      product?.colors?.length ||
      product?.sizes?.length ||
      product?.materials?.length ||
      product?.weights?.length ||
      product?.flavors?.length;

    if (!hasAnyVariants) {
      const generalStock = product?.stock ?? 0;
      if (generalStock < quantity) {
        ToastError("Lo siento, este producto está agotado.");
        return;
      }
    }

    try {
      setLoadingAddToCart(true);
      if (isAuthenticated) {
        const addToCartData: AddToCartProps = {
          content_type: "product",
          object_id: product?.id || "",
          count: quantity,
          size_id: selectedSize?.id,
          weight_id: selectedWeight?.id,
          material_id: selectedMaterial?.id,
          color_id: selectedColor?.id,
          flavor_id: selectedFlavor?.id,
          // coupon_code
        };
        await dispatch(addToCart(addToCartData));
      } else {
        const addToCartDataAnonymous: AddToCartAnonymousProps = {
          item: product,
          content_type: "product",
          object_id: product?.id || "",
          count: quantity,
          size: selectedSize,
          weight: selectedWeight,
          material: selectedMaterial,
          color: selectedColor,
          flavor: selectedFlavor,
        };

        await dispatch(addToCartAnonymous(addToCartDataAnonymous));
      }
    } catch (err) {
      ToastError(`Error adding product to cart: ${err}`);
    } finally {
      setLoadingAddToCart(false);
    }
  };

  const [loadingAddToWishlist, setLoadingAddToWishlist] = useState<boolean>(false);
  const handleAddToWishlist = async () => {
    try {
      setLoadingAddToWishlist(true);
      if (isAuthenticated) {
        const addToWishlistData: AddToWishlistProps = {
          content_type: "product",
          object_id: product?.id || "",
          count: quantity,
          size_id: selectedSize?.id,
          weight_id: selectedWeight?.id,
          material_id: selectedMaterial?.id,
          color_id: selectedColor?.id,
          flavor_id: selectedFlavor?.id,
          // coupon_code
        };
        await dispatch(addToWishlist(addToWishlistData));
      } else {
        const addToWishlistDataAnonymous: AddToWishlistAnonymousProps = {
          item: product,
          content_type: "product",
          object_id: product?.id || "",
          count: quantity,
          size: selectedSize,
          weight: selectedWeight,
          material: selectedMaterial,
          color: selectedColor,
          flavor: selectedFlavor,
        };

        await dispatch(addToWishlistAnonymous(addToWishlistDataAnonymous));
      }
    } catch (err) {
      ToastError("error adding item to wishlist");
    } finally {
      setLoadingAddToWishlist(false);
    }
  };

  const {
    originalPrice,
    salePrice,
    isDiscountActive,
    loading: loadingPrice,
  } = useProductPrice({
    slug: product?.slug,
    colorId: selectedColor?.id,
    sizeId: selectedSize?.id,
    materialId: selectedMaterial?.id,
    weightId: selectedWeight?.id,
    flavorId: selectedFlavor?.id,
  });
  return (
    <>
      <SEO {...SEOList} />
      <div className="w-full bg-white">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            <div className="lg:sticky lg:top-2">
              {/* Image gallery */}
              <ImageGallery images={product?.images} />
            </div>

            {/* Product info */}
            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product?.title}</h1>

              <div className="mt-3">
                <h2 className="sr-only">Product information</h2>

                {isDiscountActive && originalPrice != null && salePrice < originalPrice && (
                  <div className="w-full pb-2">
                    <Clock time={product?.discount_until!} />
                  </div>
                )}

                {loadingPrice ? (
                  <LoadingBar width="w-24" height="h-8" />
                ) : isDiscountActive && originalPrice != null && salePrice < originalPrice ? (
                  <div className="flex items-center space-x-4">
                    <p className="text-3xl tracking-tight text-gray-500 line-through">
                      ${originalPrice.toFixed(2)}
                    </p>
                    <p className="text-xl tracking-tight text-gray-900">${salePrice.toFixed(2)}</p>
                    <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-600/10 ring-inset">
                      {Math.round(((originalPrice - salePrice) / originalPrice) * 100)}% off
                    </span>
                  </div>
                ) : (
                  /* **SIN** “Precio anterior” cuando no hay descuento */
                  <p className="text-3xl tracking-tight text-gray-900">${salePrice.toFixed(2)}</p>
                )}
              </div>

              <div className="mt-3">
                <ProductStock stock={stock} />
              </div>

              {/* Reviews */}
              <div className="mt-3">
                <h3 className="sr-only">Reviews</h3>
                <StarRating
                  averageRating={product?.average_rating}
                  reviewCount={product?.review_count}
                />
              </div>

              <div className="mt-6">
                <h3 className="sr-only">Description</h3>

                <CollapsibleDescription description={product?.description} previewLines={6} />
              </div>

              <div className="mt-6 space-y-4">
                {/* Colors */}
                {product?.colors.length > 0 && (
                  <div>
                    <div className="text-sm/6 font-medium text-gray-900">Choose a color</div>

                    <fieldset aria-label="Choose a color" className="mt-2">
                      <div className="flex items-center gap-x-3">
                        {product?.colors.map(color => (
                          <div
                            key={color.id}
                            className="flex rounded-full outline -outline-offset-1 outline-black/10"
                          >
                            <input
                              type="radio"
                              name="color"
                              value={color.id}
                              checked={selectedColor?.id === color.id}
                              onChange={() => setSelectedColor(color)}
                              className="size-8 appearance-none rounded-full forced-color-adjust-none checked:outline checked:outline-2 checked:outline-offset-2 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px]"
                              style={{ backgroundColor: color.hex }}
                            />
                          </div>
                        ))}
                      </div>
                    </fieldset>
                  </div>
                )}

                {/* Sizes */}
                {product?.sizes?.length > 0 && (
                  <AttributeSelector
                    label="Choose a size"
                    options={product?.sizes ?? []}
                    selected={selectedSize}
                    optionType="size"
                    onChange={setSelectedSize}
                  />
                )}

                {/* Weights */}
                {product?.weights?.length > 0 && (
                  <AttributeSelector
                    label="Choose a weight"
                    options={product?.weights ?? []}
                    selected={selectedWeight}
                    optionType="weight"
                    onChange={setSelectedWeight}
                  />
                )}

                {/* Materials */}
                {product?.materials?.length > 0 && (
                  <AttributeSelector
                    label="Choose a material"
                    options={product?.materials ?? []}
                    selected={selectedMaterial}
                    optionType="material"
                    onChange={setSelectedMaterial}
                  />
                )}

                {/* Flavors */}
                {product?.flavors?.length > 0 && (
                  <AttributeSelector
                    label="Choose a flavor"
                    options={product?.flavors ?? []}
                    selected={selectedFlavor}
                    optionType="flavor"
                    onChange={setSelectedFlavor}
                  />
                )}

                <div>
                  <span className="isolate inline-flex rounded-md shadow-sm">
                    <button
                      type="button"
                      onClick={() => {
                        if (quantity > 1) {
                          setQuantity(quantity - 1);
                        }
                      }}
                      disabled={quantity === 1 || stock === 0}
                      className="dark:border-dark-border dark:bg-dark-bg dark:text-dark-txt dark:hover:bg-dark-second dark:focus:border-dark-primary dark:focus:ring-dark-primary relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    >
                      <MinusIcon className="h-5 w-auto" />
                    </button>
                    <div
                      type="button"
                      className="dark:border-dark-border dark:bg-dark-bg dark:text-dark-txt relative -ml-px inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700"
                    >
                      {stock === 0 ? 0 : quantity}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (quantity < stock) {
                          setQuantity(quantity + 1);
                        }
                      }}
                      disabled={quantity >= stock || stock === 0}
                      className="dark:border-dark-border dark:bg-dark-bg dark:text-dark-txt dark:hover:bg-dark-second dark:focus:border-dark-primary dark:focus:ring-dark-primary relative -ml-px inline-flex items-center rounded-r-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    >
                      <PlusIcon className="h-5 w-auto" />
                    </button>
                  </span>
                </div>

                <div className="mt-10 flex">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={loadingAddToCart}
                    className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-black px-8 py-3 text-base font-medium text-white hover:bg-gray-800 focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-gray-50 focus:outline-none sm:w-full"
                  >
                    {loadingAddToCart ? <LoadingMoon /> : "Add to cart"}
                  </button>

                  <button
                    type="button"
                    onClick={handleAddToWishlist}
                    className="ml-4 flex items-center justify-center rounded-md px-3 py-3 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                  >
                    {loadingAddToWishlist ? (
                      <LoadingMoon />
                    ) : (
                      <HeartIcon aria-hidden="true" className="size-6 shrink-0" />
                    )}

                    <span className="sr-only">Add to favorites</span>
                  </button>
                </div>
              </div>

              <section aria-labelledby="details-heading" className="mt-12">
                <h2 id="details-heading" className="sr-only">
                  Additional details
                </h2>

                <div className="divide-y divide-gray-200 border-t border-gray-200">
                  {product?.details.map((detail: IDetail) => (
                    <Disclosure key={detail?.id} as="div">
                      <h3>
                        <DisclosureButton className="group relative flex w-full items-center justify-between py-6 text-left">
                          <span className="text-sm font-medium text-gray-900 group-data-[open]:text-indigo-600">
                            {detail?.title}
                          </span>
                          <span className="ml-6 flex items-center">
                            <PlusIcon
                              aria-hidden="true"
                              className="block size-6 text-gray-400 group-hover:text-gray-500 group-data-[open]:hidden"
                            />
                            <MinusIcon
                              aria-hidden="true"
                              className="hidden size-6 text-indigo-400 group-hover:text-indigo-500 group-data-[open]:block"
                            />
                          </span>
                        </DisclosureButton>
                      </h3>
                      <DisclosurePanel className="pb-6">
                        <ul className="list-disc space-y-1 pl-5 text-sm/6 text-gray-700 marker:text-gray-300">
                          <li className="pl-2">{detail?.description}</li>
                        </ul>
                      </DisclosurePanel>
                    </Disclosure>
                  ))}
                </div>
              </section>
            </div>
          </div>
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-6">
            <CustomTabs
              width="w-full"
              titles={["Reviews", "Benefits", "Requisites", "Target Audience"]}
              panels={[
                <Reviews key={1} contentType="product" objectId={product?.id} />,
                <div key={2}>{benefitsPanel}</div>,
                <div key={3}>{requisitesPanel}</div>,
                <div key={4}>{audiencePanel}</div>,
              ]}
            />
          </div>
        </div>
      </div>
    </>
  );
}

Page.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

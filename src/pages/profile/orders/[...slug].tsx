import OrderItemCard from "@/components/orders/OrderItemCard";
import SEO, { SEOProps } from "@/components/pages/SEO";
import ProfileLayout from "@/hocs/ProfileLayout";
import { Order } from "@/interfaces/orders/IOrder";
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export const getServerSideProps: GetServerSideProps<{
  order: Order | null;
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

  let order: Order | null = null;

  try {
    const detailRes = await fetch(
      `${process.env.API_URL}/api/orders/detail/?order_id=${encodeURIComponent(slug)}`,
      { headers },
    );

    if (detailRes.ok) {
      const detailJson = await detailRes.json();
      order = detailJson.results;
    } else if (detailRes.status === 404) {
      return { notFound: true };
    }
  } catch (e) {
    console.error("Error fetching order:", e);
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }

  return {
    props: { order },
  };
};

type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "canceled";
const steps = ["Pedido realizado", "Pago recibido", "Enviado", "Entregado"];

export default function Page({ order }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const SEOList: SEOProps = {
    title: `Orden ${order?.id.slice(0, 8)}… | SoloPython`,
    description: order
      ? `Detalle de tu orden ${order.id}. Estado: ${
          order.status.charAt(0).toUpperCase() + order.status.slice(1)
        }, total: $${order.total}. Gracias por comprar en SoloPython.`
      : "Detalle de tu orden en SoloPython.",
    keywords: order
      ? `orden SoloPython, pedido ${order.id}, estado ${order.status}, total ${order.total}`
      : "orden SoloPython, pedido",
    href: `/orders/${order?.id}`,
    robots: "noindex, nofollow",
    author: "SoloPython",
    publisher: process.env.DOMAIN_NAME || "solopython.com",
    image:
      order && order.items && order.items.length > 0
        ? order.items[0].item.thumbnail
        : "/assets/img/thumbnails/orders_thumbnail.jpg",
    twitterHandle: "@solopython",
  };

  function formatDate(isoString: string) {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  // Updated labels
  const STATUS_LABELS: Record<OrderStatus, string> = {
    pending: "Pendiente de pago",
    paid: "Pagada",
    shipped: "Enviada",
    delivered: "Entregada",
    canceled: "Cancelada",
  };
  const statusLabel = STATUS_LABELS[order.status];

  // Single mapping to step index
  const statusToStepIndex: Record<OrderStatus, number> = {
    pending: 0,
    paid: 1,
    shipped: 2,
    delivered: 3,
    canceled: 0,
  };
  const step = statusToStepIndex[order.status];
  const last = steps.length - 1;
  const widthPercent = (step / last) * 100;

  // Dates
  const dateObj = new Date(order.updated_at);
  const dateTime = dateObj.toISOString().split("T")[0];
  const displayDate = dateObj.toLocaleDateString("es-PE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const [open, setOpen] = useState(false);

  return (
    <div>
      <SEO {...SEOList} />
      <div className="mx-auto max-w-2xl sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="space-y-2 px-4 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 sm:px-0">
          <div className="flex sm:items-baseline sm:space-x-4">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Order #{order?.id?.slice(0, 8)}
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            {order.tracking_number && (
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="text-sm font-medium text-indigo-600 hover:underline"
              >
                Track Order
              </button>
            )}
            <p className="text-sm text-gray-600">
              Order placed{" "}
              <time
                dateTime={
                  order?.created_at && new Date(order.created_at).toISOString().split("T")[0]
                }
                className="font-medium text-gray-900"
              >
                {order?.created_at ? formatDate(order.created_at) : "—"}
              </time>
            </p>
          </div>
        </div>

        {/* Products */}
        <div className="mt-6">
          <h2 className="sr-only">Products purchased</h2>

          <div className="space-y-8">
            {order?.items.map(oi => <OrderItemCard key={oi?.id} order={order} orderItem={oi} />)}
          </div>
        </div>

        <div className="mt-6">
          <h4 className="sr-only">Estado del pedido</h4>

          {/* Estado legible + fecha */}
          <p className="text-sm font-medium text-gray-900">
            {statusLabel} el <time dateTime={dateTime}>{displayDate}</time>
          </p>

          {/* Sólo mostramos progreso si NO está cancelado */}
          {order.status !== "canceled" && (
            <div aria-hidden="true" className="mt-6">
              {/* Progress bar */}
              <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-indigo-600 transition-all duration-300"
                  style={{ width: `${widthPercent}%` }}
                />
              </div>

              {/* Steps */}
              <div className="mt-6 hidden grid-cols-4 text-sm font-medium text-gray-600 sm:grid">
                {steps.map((label, idx) => (
                  <div
                    key={label}
                    className={classNames(
                      idx <= step ? "text-indigo-600" : "",
                      idx === 0 ? "text-left" : idx === last ? "text-right" : "text-center",
                    )}
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Billing */}
        <div className="mt-6">
          <h2 className="sr-only">Billing Summary</h2>

          <div className="bg-gray-100 px-4 py-6 sm:rounded-lg sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8 lg:py-8">
            <dl className="grid grid-cols-2 gap-6 text-sm sm:grid-cols-2 md:gap-x-8 lg:col-span-7">
              <div>
                <dt className="font-medium text-gray-900">Billing address</dt>
                <dd className="mt-3 text-gray-500">
                  <span className="block">{order?.shipping_address?.label ?? "—"}</span>
                  <span className="block">
                    {order?.shipping_address?.street}
                    {order?.shipping_address?.apartment
                      ? `, Apt ${order.shipping_address.apartment}`
                      : ""}
                  </span>
                  <span className="block">
                    {order?.shipping_address?.city}
                    {order?.shipping_address?.region ? `, ${order.shipping_address.region}` : ""}
                    {order?.shipping_address?.postal_code
                      ? ` ${order.shipping_address.postal_code}`
                      : ""}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-900">Payment information</dt>
                <dd className="-mt-1 -ml-4 flex flex-wrap">
                  <div className="mt-4 ml-4">
                    <p className="text-xs text-gray-600">{order?.payment_reference}</p>
                  </div>
                </dd>
              </div>
            </dl>

            <dl className="mt-8 divide-y divide-gray-200 text-sm lg:col-span-5 lg:mt-0">
              <div className="flex items-center justify-between pb-4">
                <dt className="text-gray-600">Subtotal</dt>
                <dd className="font-medium text-gray-900">${order?.subtotal}</dd>
              </div>
              <div className="flex items-center justify-between py-4">
                <dt className="text-gray-600">Shipping</dt>
                <dd className="font-medium text-gray-900">${order?.shipping_cost}</dd>
              </div>
              <div className="flex items-center justify-between py-4">
                <dt className="text-gray-600">Tax</dt>
                <dd className="font-medium text-gray-900">${order?.tax_amount}</dd>
              </div>
              <div className="flex items-center justify-between pt-4">
                <dt className="font-medium text-gray-900">Order total</dt>
                <dd className="font-medium text-indigo-600">${order?.total}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <DialogPanel
                transition
                className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
              >
                <div className="flex h-full flex-col overflow-y-auto bg-white py-6 shadow-xl">
                  <div className="px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <DialogTitle className="text-base font-semibold text-gray-900">
                        Información de seguimiento
                      </DialogTitle>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          onClick={() => setOpen(false)}
                          className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:outline-none"
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Cerrar panel</span>
                          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="relative mt-6 flex-1 px-4 sm:px-6">
                    {/* Contenido de tracking */}
                    <p className="text-sm text-gray-700">
                      <strong>Número de seguimiento:</strong>{" "}
                      <span className="font-medium">{order.tracking_number}</span>
                    </p>
                    {order.tracking_url && (
                      <a
                        href={order.tracking_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-block text-sm text-indigo-600 hover:underline"
                      >
                        Ver en sitio del transportista
                      </a>
                    )}
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

Page.getLayout = function getLayout(page: React.ReactElement) {
  return <ProfileLayout>{page}</ProfileLayout>;
};

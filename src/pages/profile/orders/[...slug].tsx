import OrderItemCard from "@/components/orders/OrderItemCard";
import SEO, { SEOProps } from "@/components/pages/SEO";
import ProfileLayout from "@/hocs/ProfileLayout";
import { Order } from "@/interfaces/orders/IOrder";
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import Link from "next/link";

const products = [
  {
    id: 1,
    name: "Nomad Tumbler",
    description:
      "This durable and portable insulated tumbler will keep your beverage at the perfect temperature during your next adventure.",
    href: "#",
    price: "35.00",
    status: "Preparing to ship",
    step: 1,
    date: "March 24, 2021",
    datetime: "2021-03-24",
    address: ["Floyd Miles", "7363 Cynthia Pass", "Toronto, ON N3Y 4H8"],
    email: "f•••@example.com",
    phone: "1•••••••••40",
    imageSrc:
      "https://tailwindcss.com/plus-assets/img/ecommerce-images/confirmation-page-03-product-01.jpg",
    imageAlt: "Insulated bottle with white base and black snap lid.",
  },
  {
    id: 2,
    name: "Minimalist Wristwatch",
    description:
      "This contemporary wristwatch has a clean, minimalist look and high quality components.",
    href: "#",
    price: "149.00",
    status: "Shipped",
    step: 0,
    date: "March 23, 2021",
    datetime: "2021-03-23",
    address: ["Floyd Miles", "7363 Cynthia Pass", "Toronto, ON N3Y 4H8"],
    email: "f•••@example.com",
    phone: "1•••••••••40",
    imageSrc:
      "https://tailwindcss.com/plus-assets/img/ecommerce-images/confirmation-page-03-product-02.jpg",
    imageAlt:
      "Arm modeling wristwatch with black leather band, white watch face, thin watch hands, and fine time markings.",
  },
];

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

  const STATUS_LABELS = {
    pending: "Pendiente de pago",
    paid: "Pagada",
    fulfilled: "Enviada / Entregada",
    canceled: "Cancelada",
  };

  // Mapeo de status a step (0..3)
  const STEP_MAP = {
    pending: 0, // sólo “Pedido realizado”
    paid: 1, // Pago recibido
    fulfilled: 3, // deja activas “Enviado” y “Entregado”
  };
  // 1. Etiqueta legible
  const statusLabel = STATUS_LABELS[order.status] || order.status;

  // 2. Cálculo de step para la barra
  const step = STEP_MAP[order.status] ?? 0;

  // 3. Formato de fecha
  const dateObj = new Date(order?.created_at);
  const dateTime = dateObj.toISOString().split("T")[0]; // YYYY‑MM‑DD
  const displayDate = dateObj.toLocaleDateString("es-PE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

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
          <p className="text-sm text-gray-600">
            Order placed{" "}
            <time
              dateTime={order?.created_at && new Date(order.created_at).toISOString().split("T")[0]}
              className="font-medium text-gray-900"
            >
              {order?.created_at ? formatDate(order.created_at) : "—"}
            </time>
          </p>
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
              {/* Barra de progreso */}
              <div className="overflow-hidden rounded-full bg-gray-200">
                <div
                  style={{ width: `calc((${step} * 2 + 1) / 8 * 100%)` }}
                  className="h-2 rounded-full bg-indigo-600"
                />
              </div>

              {/* Pasos (visible en pantallas sm en adelante) */}
              <div className="mt-6 hidden grid-cols-4 text-sm font-medium text-gray-600 sm:grid">
                <div className="text-indigo-600">Pedido realizado</div>
                <div className={classNames(step > 0 ? "text-indigo-600" : "", "text-center")}>
                  Pago recibido
                </div>
                <div className={classNames(step > 1 ? "text-indigo-600" : "", "text-center")}>
                  Enviado
                </div>
                <div className={classNames(step > 2 ? "text-indigo-600" : "", "text-right")}>
                  Entregado
                </div>
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
    </div>
  );
}

Page.getLayout = function getLayout(page: React.ReactElement) {
  return <ProfileLayout>{page}</ProfileLayout>;
};

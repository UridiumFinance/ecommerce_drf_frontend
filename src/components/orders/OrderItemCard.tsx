import Image from "next/image";
import { Order, OrderItem } from "@/interfaces/orders/IOrder";
import Link from "next/link";
import useReviews from "@/hooks/reviews/useReviews";
import { useEffect, useState } from "react";
import EditText from "../forms/EditText";
import EditTextArea from "../forms/EditTextArea";
import EditSelect from "../forms/EditSelect";
import Button from "../Button";
import LoadingMoon from "../loaders/LoadingMoon";

interface Props {
  orderItem: OrderItem;
  order: Order;
}

export default function OrderItemCard({ orderItem, order }: Props) {
  const {
    review,
    loadingReview,
    loadingCreateReview,
    loadingUpdateReview,
    onCreate,
    onUpdate,
    rating,
    setRating,
    title,
    setTitle,
    body,
    setBody,
  } = useReviews({
    contentType: "product",
    objectId: String(orderItem?.item?.id ?? ""),
    fetchReviewOnLoad: true,
  });

  const [openCreateReview, setOpenCreateReview] = useState(false);

  // Cuando llega la review, precargamos los campos
  useEffect(() => {
    if (review) {
      setRating(String(review.rating));
      setTitle(review.title);
      setBody(review.body);
    }
  }, [review, setRating, setTitle, setBody]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (review) {
      // Editamos la reseña existente
      await onUpdate(review.id);
    } else {
      // Creamos nueva reseña
      await onCreate(e);
    }

    // Luego limpiamos y cerramos
    setRating("");
    setTitle("");
    setBody("");
    setOpenCreateReview(false);
  };

  const isLoading = loadingCreateReview || loadingUpdateReview;

  return (
    <div className="border-t border-b border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border">
      <div className="px-4 py-6 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:p-8">
        {/* Imagen y datos del producto */}
        <div className="sm:flex lg:col-span-7">
          <Image
            width={512}
            height={512}
            alt={orderItem?.item?.title}
            src={orderItem?.item?.thumbnail}
            className="aspect-square w-full shrink-0 rounded-lg object-cover sm:size-40"
          />
          <div className="mt-6 sm:mt-0 sm:ml-6">
            <h3 className="text-base font-medium text-gray-900">
              <Link href={`/store/${orderItem?.item?.slug}`}>{orderItem?.item?.title}</Link>
            </h3>
            <p className="mt-2 text-sm font-medium text-gray-900">${orderItem?.item?.price}</p>
            <p className="mt-3 text-sm text-gray-500">{orderItem?.item?.description}</p>
          </div>
        </div>

        {/* Detalles de envío y botón de reseña */}
        <div className="mt-6 lg:col-span-5 lg:mt-0">
          <dl className="grid grid-cols-2 gap-x-6 text-sm">
            <div>
              <dt className="font-medium text-gray-900">Delivery address</dt>
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
              <dt className="font-medium text-gray-900">Order details</dt>
              <dd className="mt-3 space-y-2 text-gray-500">
                {[
                  { label: "Color", value: orderItem.color_title },
                  { label: "Weight", value: orderItem.weight_title },
                  { label: "Size", value: orderItem.size_title },
                  { label: "Flavor", value: orderItem.flavor_title },
                  { label: "Material", value: orderItem.material_title },
                ]
                  .filter(d => d.value)
                  .map(d => (
                    <p key={d.label}>
                      <span className="font-medium">{d.label}:</span> {d.value}
                    </p>
                  ))}
              </dd>
              <button
                type="button"
                onClick={() => setOpenCreateReview(prev => !prev)}
                className="mt-2 font-semibold text-indigo-500 hover:underline"
              >
                {review
                  ? openCreateReview
                    ? "Cancel edit"
                    : "Edit review"
                  : openCreateReview
                    ? "Cancel"
                    : "Add review"}
              </button>
            </div>
          </dl>
        </div>
      </div>

      {/* Formulario de creación/edición */}
      {openCreateReview && (
        <form onSubmit={handleSubmit} className="space-y-2 px-4 pb-6 sm:px-6">
          <EditSelect
            data={rating}
            setData={setRating}
            options={["1", "2", "3", "4", "5"]}
            placeholder="Selecciona tu calificación"
            title="Rating"
            description="Elige una calificación de 1 (malo) a 5 (excelente)"
            required
          />
          <EditText data={title} setData={setTitle} title="Title" required />
          <EditTextArea data={body} setData={setBody} title="Comment" required />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <LoadingMoon /> : review ? "Update" : "Create"}
          </Button>
        </form>
      )}
    </div>
  );
}

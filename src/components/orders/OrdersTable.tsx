import { Order } from "@/interfaces/orders/IOrder";
import LoadingBar from "../loaders/LoadingBar";
import Image from "next/image";
import Link from "next/link";

interface Props {
  orders: Order[];
  loading: boolean;
}

export default function OrdersTable({ orders, loading }: Props) {
  // número de filas de esqueleto que queremos mostrar
  const skeletonRows = Array.from({ length: 5 });

  return (
    <div className="flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Order</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Fecha</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Estado
                </th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading
                ? skeletonRows.map((_, idx) => (
                    <tr key={idx} className="even:bg-gray-50">
                      <td className="px-3 py-4 whitespace-nowrap">
                        <LoadingBar width="w-24" height="h-4" />
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <LoadingBar width="w-32" height="h-4" />
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <LoadingBar width="w-20" height="h-4" />
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <LoadingBar width="w-16" height="h-4" />
                      </td>
                    </tr>
                  ))
                : orders.map(o => {
                    const thumbnails = o.items.slice(0, 3).map(item => item.item.thumbnail);
                    const extraCount = o.items.length - thumbnails.length;
                    return (
                      <tr key={o.id} className="even:bg-gray-50">
                        {/* Columna Resumen */}
                        <td className="px-3 py-4 whitespace-nowrap">
                          <Link href={`/profile/orders/${o.id}`}>
                            <div className="flex items-center">
                              <div className="flex -space-x-1">
                                {thumbnails.map((src, i) => (
                                  <Image
                                    width={512}
                                    height={512}
                                    key={i}
                                    src={src}
                                    alt={`Thumbnail ${i + 1}`}
                                    className="h-8 w-8 rounded-md border bg-white"
                                  />
                                ))}
                                {extraCount > 0 && (
                                  <span className="ml-2 text-xs text-gray-500">+{extraCount}</span>
                                )}
                              </div>
                            </div>
                          </Link>
                        </td>

                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                          {new Date(o.created_at).toLocaleDateString()}
                        </td>

                        <td className="px-3 py-4 text-sm whitespace-nowrap">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium capitalize ring-1 ring-inset ${o.status === "paid" && "bg-green-50 text-green-700 ring-green-600/20"} ${o.status === "pending" && "bg-gray-50 text-gray-700 ring-gray-600/20"} ${o.status === "canceled" && "bg-rose-50 text-rose-700 ring-rose-600/20"} ${o.status === "fulfilled" && "bg-blue-50 text-blue-700 ring-blue-600/20"} `}
                          >
                            {o.status}
                          </span>
                        </td>
                        <td className="px-3 py-4 text-sm font-semibold whitespace-nowrap text-gray-500">
                          ${o.total}
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { ICategory } from "@/interfaces/products/ICategory";
import Link from "next/link";

interface ComponentProps {
  category: ICategory;
}

interface StatsCard {
  label: string;
  value: number;
  isCurrency?: boolean;
}

export default function Header({ category }: ComponentProps) {
  const stats: StatsCard[] = [
    { label: "Vistas", value: category.analytics_views },
    { label: "Me gusta", value: category.analytics_likes },
    { label: "Compartidos", value: category.analytics_shares },
    // { label: "Wishlist", value: category.analytics_wishlist },
    // { label: "Añadidos al carrito", value: category.analytics_add_to_cart },
    { label: "Compras", value: category.analytics_purchases },
    // { label: "Ingresos", value: category.analytics_revenue, isCurrency: true },
  ];

  const formatValue = (stat: StatsCard) => {
    if (stat.isCurrency) {
      // formatea con símbolo local (ajusta 'es-PE' y 'PEN' como necesites)
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      }).format(stat.value);
    }
    return new Intl.NumberFormat("en-US").format(stat.value);
  };

  return (
    <div className="space-y-6">
      <h1 className="max-w-[30ch] text-2xl font-bold tracking-tight break-words italic lg:text-4xl">
        {category?.title}
      </h1>
      <p className="max-w-[120ch] tracking-tight break-words">{category?.description}</p>
      <dl className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(stat => (
          <div key={stat.label} className="flex flex-col">
            <dt className="text-sm font-medium text-gray-500">{stat.label}</dt>
            <dd className="text-md mt-1 font-semibold text-gray-900">{formatValue(stat)}</dd>
          </div>
        ))}
      </dl>
      <div className="flex items-center space-x-2">
        <strong>Related</strong>
        {category?.related_categories.map(cat => (
          <Link
            key={cat?.id}
            href={`/topic/${cat?.slug}`}
            className="rounded border px-4 py-1.5 font-semibold hover:bg-gray-50"
          >
            {cat?.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

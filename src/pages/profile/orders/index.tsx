import OrdersTable from "@/components/orders/OrdersTable";
import SEO, { SEOProps } from "@/components/pages/SEO";
import StandardPagination from "@/components/pagination/StandardPagination";
import ProfileLayout from "@/hocs/ProfileLayout";
import useOrders from "@/hooks/orders/useOrders";

const SEOList: SEOProps = {
  title: "Mis Pedidos | SoloPython",
  description:
    "Consulta y gestiona tus pedidos de cursos y recursos en SoloPython. Revisa el estado de tus compras, descarga materiales y realiza seguimiento de tus envíos desde tu cuenta.",
  keywords:
    "mis pedidos, pedidos SoloPython, seguimiento de pedidos, historial de compras, cursos Python, recursos Python",
  href: "/orders",
  robots: "noindex, nofollow",
  author: "SoloPython",
  publisher: process.env.DOMAIN_NAME || "solopython.com",
  image: "/assets/img/thumbnails/orders_thumbnail.jpg",
  twitterHandle: "@solopython",
};

export default function Page() {
  const { orders, loading, count, pageSize, currentPage, setCurrentPage } = useOrders({
    searchBy: "",
    pageSize: 8,
  });
  return (
    <div>
      <SEO {...SEOList} />
      <main>
        <OrdersTable orders={orders} loading={loading} />
        <StandardPagination
          data={orders}
          count={count}
          pageSize={pageSize}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </main>
    </div>
  );
}

Page.getLayout = function getLayout(page: React.ReactElement) {
  return <ProfileLayout>{page}</ProfileLayout>;
};

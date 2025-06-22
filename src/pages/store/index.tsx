import ProductsList from "@/components/pages/products/ProductsList";
import Layout from "@/hocs/Layout";
import useProducts from "@/hooks/useProducts";

export default function Page() {
  const {
    products,
    loading,
    loadingMore,
    loadMore,
    nextUrl,
    count,
    pageSize,
    currentPage,
    setCurrentPage,
  } = useProducts({ pageSize: 8 });

  return (
    <div>
      <ProductsList
        products={products}
        loading={loading}
        loadingMore={loadingMore}
        loadMore={loadMore}
        nextUrl={nextUrl}
        count={count}
        pageSize={pageSize}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pagination
        title="Recommended products"
      />
    </div>
  );
}

Page.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

import CategoriesList from "@/components/pages/categories/CategoriesList";
import ProductsList from "@/components/pages/products/ProductsList";
import SEO, { SEOProps } from "@/components/pages/SEO";
import Layout from "@/hocs/Layout";
import useCategories from "@/hooks/useCategories";
import useProducts from "@/hooks/useProducts";

const SEOList: SEOProps = {
  title: "Tienda de productos Python | SoloPython",
  description:
    "Explora nuestra tienda con productos seleccionados para programadores: cursos, libros, herramientas y recursos para aprender Python de forma efectiva.",
  keywords:
    "tienda Python, cursos Python, libros de Python, herramientas programación, SoloPython store",
  href: "/store",
  robots: "index, follow",
  author: "SoloPython",
  publisher: process.env.DOMAIN_NAME || "solopython.com",
  image: "/assets/img/thumbnails/default_thumbnail.jpg",
  twitterHandle: "@solopython",
};

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

  const {
    categories,
    loading: loadingCategories,
    loadingMore: loadingMoreCategories,
    loadMore: loadMoreCategories,
    nextUrl: nextUrlCategories,
  } = useCategories({ pageSize: 8 });

  return (
    <div className="w-full">
      <SEO {...SEOList} />
      <CategoriesList
        categories={categories}
        loading={loadingCategories}
        loadingMore={loadingMoreCategories}
        loadMore={loadMoreCategories}
        nextUrl={nextUrlCategories}
        title="Categories"
      />
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
        horizontal
        infiniteScroll
        title="Recommended products"
      />
    </div>
  );
}

Page.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

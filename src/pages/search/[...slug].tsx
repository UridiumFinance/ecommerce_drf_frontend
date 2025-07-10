import LoadingMoon from "@/components/loaders/LoadingMoon";
import SearchComponent from "@/components/pages/search/SearchComponent";
import SEO, { SEOProps } from "@/components/pages/SEO";
import Layout from "@/hocs/Layout";
import useCategories from "@/hooks/useCategories";
import useProducts from "@/hooks/useProducts";
import { SORTING_LABELS, ORDERING_LABELS } from "@/utils/constants/sortingOptions";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Page() {
  const router = useRouter();
  const { slug } = router.query;

  const SEOList: SEOProps = {
    title: `Resultados para "${slug}" | SoloPython`,
    description: `Explora productos relacionados con "${slug}" en SoloPython. Encuentra cursos, libros, herramientas y recursos de programación Python.`,
    keywords: `buscar ${slug}, productos Python, recursos Python, SoloPython`,
    href: `/search/${slug}`,
    robots: "noindex, nofollow",
    author: "SoloPython",
    publisher: process.env.DOMAIN_NAME || "solopython.com",
    image: "/assets/img/thumbnails/default_thumbnail.jpg",
    twitterHandle: "@solopython",
  };

  const [categoriesSlugList, setCategoriesSlugList] = useState<string[]>([]);

  const {
    categories,
    // loading: loadingCategories,
    // loadingMore: loadingMoreCategories,
    // loadMore: loadMoreCategories,
    // nextUrl: nextUrlCategories,
  } = useCategories({ pageSize: 16, all: true });

  const {
    products,
    loading,
    sorting,
    setSorting,
    ordering,
    setOrdering,
    count,
    pageSize,
    currentPage,
    setCurrentPage,
  } = useProducts({
    searchBy: slug,
    pageSize: 8,
    categories: categoriesSlugList,
  });

  const sortOptions = Object.entries(SORTING_LABELS).map(([value, name]) => ({
    name,
    value,
    current: sorting === value,
  }));

  const orderOptions = Object.entries(ORDERING_LABELS).map(([value, name]) => ({
    name,
    value,
    current: ordering === value,
  }));

  const handleChangeSorting = (val: string) => {
    setCurrentPage(1);
    setSorting(val);
  };

  const handleChangeOrdering = (val: string) => {
    setCurrentPage(1);
    setOrdering(val);
  };

  return (
    <div className="relative w-full">
      <SEO {...SEOList} />

      <SearchComponent
        searchTerm={slug}
        sortOptions={sortOptions}
        setSorting={handleChangeSorting}
        setOrdering={handleChangeOrdering}
        orderOptions={orderOptions}
        products={products}
        count={count}
        pageSize={pageSize}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        categoriesSlugList={categoriesSlugList}
        setCategoriesSlugList={setCategoriesSlugList}
        categories={categories}
        loading={loading}
      />
    </div>
  );
}

Page.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

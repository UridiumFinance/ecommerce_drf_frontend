import CategoriesList from "@/components/pages/categories/CategoriesList";
import Header from "@/components/pages/categories/Header";
import ProductsList from "@/components/pages/products/ProductsList";
import SEO, { SEOProps } from "@/components/pages/SEO";
import Layout from "@/hocs/Layout";
import useCategories from "@/hooks/useCategories";
import useProducts from "@/hooks/useProducts";
import { ICategory } from "@/interfaces/products/ICategory";
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from "next";

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const { slug } = context.params as { slug: string };

  const { req } = context;
  const accessToken = req.cookies.access;

  let category: ICategory | null = null;

  // Fetch
  try {
    const headers: Record<string, string> = {
      Accept: "application/json",
      "API-Key": `${process.env.BACKEND_API_KEY}`,
    };

    if (accessToken) {
      headers.Authorization = `JWT ${accessToken}`;
    }

    const apiRes = await fetch(`${process.env.API_URL}/api/products/category/?slug=${slug}`, {
      headers,
    });

    const data = await apiRes.json();

    if (apiRes.status === 200) {
      category = data.results;
    }
    // eslint-disable-next-line
  } catch (e) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }

  return {
    props: {
      category,
    },
  };
};

export default function Page({ category }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const SEOList: SEOProps = {
    title: `${category?.name} ${category?.title ? `| ${category?.title}` : ""} `,
    description: `${category?.description}`,
    keywords: `${category?.title}`,
    href: `${process.env.DOMAIN}/topic/${category?.slug}`,
    robots: "index, follow",
    author: "SoloPython",
    publisher: `${process.env.DOMAIN_NAME}`,
    image: `${category?.thumbnail ? category?.thumbnail : "/assets/img/thumbnails/default_thumbnail.jpg"}`,
    twitterHandle: "@solopython",
  };

  const {
    categories,
    loading: loadingCategories,
    loadingMore: loadingMoreCategories,
    loadMore: loadMoreCategories,
    nextUrl: nextUrlCategories,
  } = useCategories({ pageSize: 8 });

  const otherCategories = categories.filter(cat => cat.id !== category?.id);

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
  } = useProducts({ pageSize: 8, categories: category?.slug });

  return (
    <div className="w-full">
      <SEO {...SEOList} />
      <Header category={category} />
      <div className="py-4" />
      <CategoriesList
        categories={otherCategories}
        loading={loadingCategories}
        loadingMore={loadingMoreCategories}
        loadMore={loadMoreCategories}
        nextUrl={nextUrlCategories}
        title="Customers also buy"
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
        title={`Top products related to: ${category?.name}`}
      />
    </div>
  );
}

Page.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

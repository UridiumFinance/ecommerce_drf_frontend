import { ToastError } from "@/components/toast/alerts";
import { ICategory } from "@/interfaces/products/ICategory";
import fetchCategories, { FetchCategoriesProps } from "@/utils/api/products/categories/list";
import { useCallback, useEffect, useState } from "react";

interface ComponentProps {
  searchBy?: string;
  parentSlug?: string;
  pageSize?: number;
  all?: boolean;
}

export default function useCategories({
  pageSize,
  searchBy,
  parentSlug,
  all = false,
}: ComponentProps) {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  const [nextUrl, setNextUrl] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSizeState, setPageSize] = useState<number>(pageSize || 12);
  const [ordering, setOrdering] = useState<string>("");
  const [sorting, setSorting] = useState<string>("");
  const [searchByString, setSearchBy] = useState<string>(searchBy || "");

  const listCategories = useCallback(
    async (page: number, search: string | undefined) => {
      try {
        setLoading(true);

        const fetchCategoriesData: FetchCategoriesProps = {
          p: page,
          page_size: pageSizeState,
          parent_slug: parentSlug,
          search,
          sorting,
          ordering,
          all,
        };

        const res = await fetchCategories(fetchCategoriesData);

        if (res.status === 200) {
          setCategories(res.results);
          setCount(res.count);
          setNextUrl(res.next);
        }
      } catch (err) {
        ToastError(`Error fetching categories. ${err}`);
      } finally {
        setLoading(false);
      }
    },
    [pageSizeState, ordering, sorting, parentSlug, all],
  );

  useEffect(() => {
    listCategories(1, searchByString);
    // eslint-disable-next-line
  }, [listCategories, currentPage]);

  const onSubmitSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    listCategories(1, searchByString);
  };

  const loadMore = async () => {
    if (nextUrl) {
      try {
        setLoadingMore(true);

        // Extraer querystring de query params
        const url = new URL(nextUrl);
        const queryParams = new URLSearchParams(url.search);

        // Convertir URLSearchParams a un objeto para el handler
        const params: any = {};
        queryParams.forEach((value, key) => {
          params[key] = value;
        });

        const fetchCategoriesData: FetchCategoriesProps = {
          ...params,
        };

        const res = await fetchCategories(fetchCategoriesData);

        if (res.status === 200) {
          setCategories([...categories, ...res.results]);
          setCount(res.count);
          setNextUrl(res.next);
        }
      } catch (err) {
        ToastError(`Error fetching more categories. ${err}`);
      } finally {
        setLoadingMore(false);
      }
    }
  };

  return {
    categories,
    loading,
    loadingMore,
    count,
    nextUrl,
    pageSize: pageSizeState,
    currentPage,
    ordering,
    sorting,
    searchByString,
    setCurrentPage,
    setPageSize,
    setOrdering,
    setSorting,
    setCategories,
    loadMore,
    listCategories,
    setSearchBy,
    onSubmitSearch,
  };
}

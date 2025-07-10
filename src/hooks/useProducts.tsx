import { ToastError } from "@/components/toast/alerts";
import { IProductList } from "@/interfaces/products/IProduct";
import fetchProducts, { FetchProductsProps } from "@/utils/api/products/list";
import { useCallback, useEffect, useState } from "react";

interface ComponentProps {
  searchBy?: string;
  pageSize?: number;
  categories?: string[];
  fetchOnMount?: boolean;
}

export default function useProducts({
  searchBy,
  pageSize,
  categories,
  fetchOnMount = true,
}: ComponentProps) {
  const [products, setProducts] = useState<IProductList[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  const [nextUrl, setNextUrl] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSizeState, setPageSize] = useState<number>(pageSize || 12);
  const [ordering, setOrdering] = useState<string>("");
  const [sorting, setSorting] = useState<string>("");
  const [searchByString, setSearchBy] = useState<string>(searchBy || "");

  const listProducts = useCallback(
    async (page: number, search: string | undefined) => {
      if (!fetchOnMount && !searchByString.trim()) {
        // No disparamos al montar si fetchOnMount=false y no hay búsqueda
        return;
      }

      try {
        setLoading(true);

        const fetchProductsData: FetchProductsProps = {
          p: page,
          page_size: pageSizeState,
          search,
          sorting,
          ordering,
          categories,
        };

        const res = await fetchProducts(fetchProductsData);

        if (res.status === 200) {
          setProducts(res.results);
          setCount(res.count);
          setNextUrl(res.next);
        }
      } catch (err) {
        ToastError(`Error fetching products. ${err}`);
      } finally {
        setLoading(false);
      }
    },
    [pageSizeState, ordering, sorting, categories, fetchOnMount],
  );

  useEffect(() => {
    listProducts(1, searchByString);
    // eslint-disable-next-line
  }, [listProducts, currentPage]);

  const onSubmitSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    listProducts(1, searchByString);
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

        const fetchProductsData: FetchProductsProps = {
          ...params,
          categories,
        };

        const res = await fetchProducts(fetchProductsData);

        if (res.status === 200) {
          setProducts([...products, ...res.results]);
          setCount(res.count);
          setNextUrl(res.next);
        }
      } catch (err) {
        ToastError(`Error fetching more products. ${err}`);
      } finally {
        setLoadingMore(false);
      }
    }
  };

  return {
    products,
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
    setSearchBy,
    setProducts,
    loadMore,
    listProducts,
    onSubmitSearch,
  };
}

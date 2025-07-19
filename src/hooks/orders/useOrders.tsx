import { ToastError } from "@/components/toast/alerts";
import { Order } from "@/interfaces/orders/IOrder";
import fetchOrders, { FetchOrdersProps } from "@/utils/api/orders/list";
import { useCallback, useEffect, useState } from "react";

interface Props {
  searchBy?: string;
  pageSize?: number;
}

export default function useOrders({ searchBy, pageSize }: Props) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  const [nextUrl, setNextUrl] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSizeState, setPageSize] = useState<number>(pageSize || 12);
  const [ordering, setOrdering] = useState<string>("");
  const [searchByString, setSearchBy] = useState<string>(searchBy || "");

  const listOrders = useCallback(
    async (page: number, search: string | undefined) => {
      try {
        setLoading(true);

        const payload: FetchOrdersProps = {
          p: page,
          page_size: pageSizeState,
          search,
          ordering,
        };

        const res = await fetchOrders(payload);

        if (res.status === 200) {
          setOrders(res.results);
          setCount(res.count);
          setNextUrl(res.next);
        }
      } catch (err) {
        ToastError(`Error fetching orders. ${err}`);
      } finally {
        setLoading(false);
      }
    },
    [pageSizeState, ordering],
  );

  useEffect(() => {
    listOrders(1, searchByString);
    // eslint-disable-next-line
  }, [listOrders, currentPage]);

  const onSubmitSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    listOrders(1, searchByString);
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

        const payload: FetchOrdersProps = {
          ...params,
        };

        const res = await fetchOrders(payload);

        if (res.status === 200) {
          setOrders([...orders, ...res.results]);
          setCount(res.count);
          setNextUrl(res.next);
        }
      } catch (err) {
        ToastError(`Error fetching more orders. ${err}`);
      } finally {
        setLoadingMore(false);
      }
    }
  };

  return {
    orders,
    loading,
    loadingMore,
    count,
    nextUrl,
    pageSize: pageSizeState,
    currentPage,
    ordering,
    searchByString,
    setCurrentPage,
    setPageSize,
    setOrdering,
    setSearchBy,
    setOrders,
    loadMore,
    listOrders,
    onSubmitSearch,
  };
}

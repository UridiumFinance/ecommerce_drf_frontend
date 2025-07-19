import { ToastError } from "@/components/toast/alerts";
import { IReview } from "@/interfaces/reviews/IReview";
import { createReview, CreateReviewProps } from "@/utils/api/reviews/create";
import fetchReview, { FetchReviewProps } from "@/utils/api/reviews/get";
import fetchReviews, { FetchReviewsProps } from "@/utils/api/reviews/list";
import { updateReview, UpdateReviewProps } from "@/utils/api/reviews/update";
import { useCallback, useEffect, useState } from "react";

interface Props {
  contentType: string;
  objectId: string;
  pageSize?: number;
  fetchListOnLoad?: boolean;
  fetchReviewOnLoad?: boolean;
}

export default function useReviews({
  contentType,
  objectId,
  pageSize,
  fetchListOnLoad = false,
  fetchReviewOnLoad = false,
}: Props) {
  const [review, setReview] = useState<IReview>();
  const [loadingReview, setLoadingReview] = useState<boolean>(false);

  const getReview = useCallback(async () => {
    try {
      setLoadingReview(true);
      const payload: FetchReviewProps = {
        content_type: contentType,
        object_id: objectId,
      };
      const res = await fetchReview(payload);
      if (res.status === 200) {
        setReview(res.results);
      }
    } catch (err) {
      ToastError(`Error fetching review: ${err}`);
    } finally {
      setLoadingReview(false);
    }
  }, [contentType, objectId]);

  useEffect(() => {
    if (fetchReviewOnLoad) getReview();
    // eslint-disable-next-line
  }, [getReview]);

  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loadingReviews, setLoadingReviews] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  const [nextUrl, setNextUrl] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSizeState, setPageSize] = useState<number>(pageSize || 12);
  const [average, setAverage] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [counts, setCounts] = useState();

  const listReviews = useCallback(
    async (page: number) => {
      try {
        setLoadingReviews(true);

        const payload: FetchReviewsProps = {
          p: page,
          page_size: pageSizeState,
          content_type: contentType,
          object_id: objectId,
        };

        const res = await fetchReviews(payload);

        if (res.status === 200) {
          setReviews(res.results);
          setAverage(res.extra_data.average);
          setTotalCount(res.extra_data.totalCount);
          setCounts(res.extra_data.counts);
          setCount(res.count);
          setNextUrl(res.next);
        }
      } catch (err) {
        ToastError(`Error fetching reviews. ${err}`);
      } finally {
        setLoadingReviews(false);
      }
    },
    [pageSizeState, contentType, objectId],
  );

  useEffect(() => {
    if (fetchListOnLoad) listReviews(1);
    // eslint-disable-next-line
  }, [listReviews, currentPage]);

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

        const payload: FetchReviewsProps = {
          ...params,
        };

        const res = await fetchReviews(payload);

        if (res.status === 200) {
          setReviews([...reviews, ...res.results]);
          setAverage(res.extra_data.average);
          setTotalCount(res.extra_data.totalCount);
          setCounts(res.extra_data.counts);
          setCount(res.count);
          setNextUrl(res.next);
        }
      } catch (err) {
        ToastError(`Error fetching more reviews. ${err}`);
      } finally {
        setLoadingMore(false);
      }
    }
  };

  const [loadingCreateReview, setLoadingCreateReview] = useState<boolean>(false);
  const [loadingUpdateReview, setLoadingUpdateReview] = useState<boolean>(false);
  const [rating, setRating] = useState<string>("1");
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");

  async function onCreate(e: any) {
    e.preventDefault();
    try {
      setLoadingCreateReview(true);
      const payload: CreateReviewProps = {
        content_type: contentType,
        object_id: objectId,
        rating,
        title,
        body,
        is_active: true,
      };
      const res = await createReview(payload);
      setReview(res.results);
      return res.results;
    } catch (err) {
      ToastError(`Failed creating review: ${err}`);
    } finally {
      setLoadingCreateReview(false);
    }
    return null;
  }

  const onUpdate = useCallback(
    async (reviewId: string) => {
      try {
        setLoadingUpdateReview(true);
        const payload: UpdateReviewProps = {
          id: reviewId,
          content_type: contentType,
          object_id: objectId,
          rating,
          title,
          body,
          is_active: true,
        };
        const res = await updateReview(payload);
        setReview(res.results);
        return res.results;
      } catch (err) {
        ToastError(`Failed updating review: ${err}`);
      } finally {
        setLoadingUpdateReview(false);
      }
      return null;
    },
    [contentType, objectId, rating, title, body],
  );

  return {
    review,
    loadingReview,
    getReview,
    reviews,
    loadingReviews,
    loadingMore,
    listReviews,
    loadMore,
    count,
    pageSize: pageSizeState,
    currentPage,
    setCurrentPage,
    setPageSize,
    onCreate,
    loadingCreateReview,
    rating,
    setRating,
    title,
    setTitle,
    body,
    setBody,
    loadingUpdateReview,
    onUpdate,
    average,
    totalCount,
    counts,
  };
}

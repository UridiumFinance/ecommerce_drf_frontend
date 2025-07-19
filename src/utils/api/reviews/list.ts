import buildQueryString from "@/utils/buildQueryString";

export interface FetchReviewsProps {
  p: number;
  page_size: number | undefined;
  content_type: string | undefined;
  object_id: string | undefined;
}

export default async function fetchReviews(props: FetchReviewsProps) {
  try {
    const res = await fetch(`/api/reviews/list?${buildQueryString(props)}`);
    const data = await res.json();
    if (res.status === 200) {
      return data;
    }

    if (res.status === 404) {
      return data;
    }
  } catch (e) {
    return e;
  }

  return null;
}

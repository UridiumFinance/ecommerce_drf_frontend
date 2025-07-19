import buildQueryString from "@/utils/buildQueryString";

export interface FetchReviewProps {
  content_type: string;
  object_id: string;
}

export default async function fetchReview(props: FetchReviewProps) {
  try {
    const res = await fetch(`/api/reviews/get?${buildQueryString(props)}`);
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

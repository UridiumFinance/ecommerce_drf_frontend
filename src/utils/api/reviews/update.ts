export interface UpdateReviewProps {
  id: string;
  content_type: string;
  object_id: string;
  rating: number;
  title: string;
  body: string;
  is_active: boolean;
}

export async function updateReview(props: UpdateReviewProps) {
  try {
    const res = await fetch("/api/reviews/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(props), // ahora enviamos method + data
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.log(`Error updating review: ${err}`);
    return null;
  }
}

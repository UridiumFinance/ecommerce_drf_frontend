export interface CreateReviewProps {
  content_type: string;
  object_id: string;
  rating: number;
  title: string;
  body: string;
  is_active: boolean;
}

export async function createReview(props: CreateReviewProps) {
  try {
    const res = await fetch("/api/reviews/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(props), // ahora enviamos method + data
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.log(`Error creating review: ${err}`);
    return null;
  }
}

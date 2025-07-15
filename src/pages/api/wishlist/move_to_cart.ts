import parseCookies from "@/utils/parseCookies";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  const cookies = parseCookies(req.headers.cookie || "");
  const accessToken = cookies.access;
  if (!accessToken) {
    return res.status(401).json({ error: "User unauthorized to make this request" });
  }

  // Extraemos el cart_item_id del body
  const { wishlistItemId } = req.body;
  if (!wishlistItemId) {
    return res.status(400).json({ error: "Falta `wishlistItemId` en el body" });
  }

  try {
    const apiRes = await fetch(
      `${process.env.API_URL}/api/wishlist/move-from-wishlist/${wishlistItemId}/`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `JWT ${accessToken}`,
          "API-Key": process.env.BACKEND_API_KEY!,
        },
      },
    );
    const data = await apiRes.json();
    return res.status(apiRes.status).json(data);
  } catch (err: any) {
    return res.status(500).json({ error: "Something went wrong" });
  }
}

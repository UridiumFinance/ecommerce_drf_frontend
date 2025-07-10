export interface ICategory {
  id: string;
  parent: string | null;
  children: ICategory[];
  name: string;
  title: string | null;
  description: string;
  thumbnail: string | null;
  slug: string;
  analytics_views: number;
  analytics_likes: number;
  analytics_shares: number;
  analytics_wishlist: number;
  analytics_add_to_cart: number;
  analytics_purchases: number;
  analytics_revenue: number;
  related_categories: ICategory[];
}

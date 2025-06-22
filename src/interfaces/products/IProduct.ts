import IBenefit from "./IBenefit";
import IDetail from "./IDetail";
import IRequisite from "./IRequisite";
import ITargetAudience from "./ITargetAudience";

export interface IProductList {
  id: string;
  thumbnail: string;
  author: any;
  title: string;
  short_description: any;
  slug: string;
  price: number;
  compare_price: number;
  discount: boolean;
  discount_until: string;
  stock: number;
  limited_edition: boolean;
  condition: string;
}

export default interface IProduct {
  id: string;
  details: IDetail[];
  requisites: IRequisite[];
  benefits: IBenefit[];
  target_audience: ITargetAudience[];
  thumbnail: string;
  has_liked: boolean;
  author: any;
  title: string;
  short_description: any;
  description: string;
  keywords: string;
  slug: string;
  price: number;
  compare_price: number;
  discount: boolean;
  discount_until: string;
  stock: number;
  hidden: boolean;
  banned: boolean;
  can_delete: boolean;
  limited_edition: boolean;
  condition: string;
  packaging: string;
  status: string;
  created_at: string;
  updated_at: string;
  images: string[];
}

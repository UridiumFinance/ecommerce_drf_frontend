import IBenefit from "./IBenefit";
import { ICategory } from "./ICategory";
import IColor from "./IColor";
import IDetail from "./IDetail";
import IFlavor from "./IFlavor";
import IMaterial from "./IMaterial";
import IRequisite from "./IRequisite";
import ISize from "./ISize";
import ITargetAudience from "./ITargetAudience";
import IWeight from "./IWeight";

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
  average_rating: number;
  review_count: number;
  category: ICategory;
  min_price: number;
  sizes: ISize[];
  weights: IWeight[];
  colors: IColor[];
  flavors: IFlavor[];
  materials: IMaterial[];
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
  price_with_all_attributes: number;
  price_with_selected: number;
  total_attributes_price: number;

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
  average_rating: number;
  review_count: number;
  category: ICategory;
  sizes: ISize[];
  weights: IWeight[];
  colors: IColor[];
  flavors: IFlavor[];
  materials: IMaterial[];
}

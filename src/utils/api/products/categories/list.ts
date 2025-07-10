import buildQueryString from "@/utils/buildQueryString";

export interface FetchCategoriesProps {
  p: number;
  page_size: number;
  parent_slug?: string;
  search?: string;
  sorting?: string;
  ordering?: string;
  all?: boolean;
}

export default async function fetchCategories(props: FetchCategoriesProps) {
  try {
    const res = await fetch(`/api/products/categories/list?${buildQueryString(props)}`);
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

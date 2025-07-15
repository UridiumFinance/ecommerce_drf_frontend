import buildQueryString from "@/utils/buildQueryString";

export interface FetchDefaultShippingAddressesProps {}

export default async function fetchDefaultShippingAddress(
  props: FetchDefaultShippingAddressesProps,
) {
  try {
    const res = await fetch(`/api/addresses/get?${buildQueryString(props)}`);
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

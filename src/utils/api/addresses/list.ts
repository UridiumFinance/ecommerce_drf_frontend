import buildQueryString from "@/utils/buildQueryString";

export interface FetchShippingAddressesProps {}

export default async function fetchShippingAddresses(props: FetchShippingAddressesProps) {
  try {
    const res = await fetch(`/api/addresses/list?${buildQueryString(props)}`);
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

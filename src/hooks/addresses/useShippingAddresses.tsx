import { ToastError } from "@/components/toast/alerts";
import { IAddress } from "@/interfaces/addresses/IAddress";
import { createShippingAddress, CreateShippingAddressProps } from "@/utils/api/addresses/create";
import fetchDefaultShippingAddress from "@/utils/api/addresses/get";
import fetchShippingAddresses from "@/utils/api/addresses/list";
import { setShippingAddress } from "@/utils/api/addresses/set";
import { useCallback, useEffect, useState } from "react";

interface Props {
  initialFetch?: boolean;
}

export default function useShippingAddresses({ initialFetch = true }: Props) {
  const [loadingList, setLoadingList] = useState<boolean>(false);
  const [loadingDefaultAddress, setLoadingDefaultAddress] = useState<boolean>(false);
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [defaultAddress, setDefaultAddress] = useState<IAddress>();

  const [loadingSetAddress, setLoadingSetAddress] = useState<boolean>(false);

  const [loadingCreateAddress, setLoadingCreateAddress] = useState<boolean>(false);
  const [label, setLabel] = useState<string>("");
  const [street, setStreet] = useState<string>("");
  const [apartment, setApartment] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [region, setRegion] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [isDefault, setIsDefault] = useState<boolean>(true);

  const onList = useCallback(async () => {
    try {
      setLoadingList(true);
      const res = await fetchShippingAddresses({});
      setAddresses(res?.results);
    } catch (err) {
      ToastError(`Failed fetching addresses: ${err}`);
    } finally {
      setLoadingList(false);
    }
  }, []);

  const onGet = useCallback(async () => {
    try {
      setLoadingDefaultAddress(true);
      const res = await fetchDefaultShippingAddress({});
      setDefaultAddress(res?.results);
    } catch (err) {
      ToastError(`Failed fetching default address: ${err}`);
    } finally {
      setLoadingDefaultAddress(false);
    }
  }, []);

  const onCreate = async (e: any) => {
    e.preventDefault();
    try {
      setLoadingCreateAddress(true);
      const createShippingAddressData: CreateShippingAddressProps = {
        label,
        street,
        apartment,
        city,
        region,
        postal_code: postalCode,
        country,
        is_default: isDefault,
      };
      const res = await createShippingAddress(createShippingAddressData);
      setAddresses(prev => [...prev, res.results]);
      return res.results;
    } catch (err) {
      ToastError(`Failed creating address: ${err}`);
    } finally {
      setLoadingCreateAddress(false);
    }
  };

  const onSet = useCallback(
    async (id: string) => {
      try {
        setLoadingSetAddress(true);
        await setShippingAddress({ shippingAddressId: id });
        // Actualizo localmente para reflejar el cambio de default
        setAddresses(prev =>
          prev.map(addr => ({
            ...addr,
            is_default: addr.id === id,
          })),
        );
        // Opcional: si tienes un defaultAddress separado
        setDefaultAddress(addresses.find(a => a.id === id));
      } catch (err) {
        ToastError(`Failed setting address: ${err}`);
      } finally {
        setLoadingSetAddress(false);
      }
    },
    [addresses],
  );

  useEffect(() => {
    if (initialFetch) onList();
  }, [onList, initialFetch]);

  return {
    addresses,
    loadingList,
    onGet,
    onList,
    onCreate,
    onSet,
    loadingSetAddress,
    loadingDefaultAddress,
    defaultAddress,
    loadingCreateAddress,
    setLabel,
    setStreet,
    setCity,
    setRegion,
    setPostalCode,
    setCountry,
    setIsDefault,
    label,
    street,
    city,
    region,
    postalCode,
    country,
    isDefault,
    apartment,
    setApartment,
  };
}

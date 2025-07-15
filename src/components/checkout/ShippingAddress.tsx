// components/ShippingAddress.tsx
import { useEffect, useState } from "react";
import { countries } from "countries-list";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { TruckIcon } from "@heroicons/react/24/outline";
import useShippingAddresses from "@/hooks/addresses/useShippingAddresses";
import Button from "../Button";
import LoadingMoon from "../loaders/LoadingMoon";
import { ToastError } from "../toast/alerts";

interface ShippingAddressProps {
  onAddressesChange?: (addresses: any[]) => void;
}

export default function ShippingAddress({ onAddressesChange }: ShippingAddressProps) {
  const countryOptions = Object.entries(countries).map(([code, { name }]) => ({ code, name }));

  const [addAddress, setAddAddress] = useState<boolean>(false);
  const {
    addresses,
    setLabel,
    setStreet,
    setApartment,
    setCity,
    setRegion,
    setPostalCode,
    setCountry,
    setIsDefault,
    label,
    street,
    apartment,
    city,
    region,
    postalCode,
    country,
    isDefault,
    onCreate,
    onSet,
    loadingCreateAddress,
  } = useShippingAddresses({});

  // Cada vez que addresses cambie, se lo reportamos al padre
  useEffect(() => {
    if (onAddressesChange) {
      onAddressesChange(addresses);
    }
  }, [addresses, onAddressesChange]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1) Definimos los campos obligatorios
    const requiredFields: { value: string; name: string }[] = [
      { value: label, name: "Label" },
      { value: street, name: "Street" },
      { value: apartment, name: "Apartment" },
      { value: city, name: "City" },
      { value: region, name: "Region" },
      { value: postalCode, name: "Postal code" },
      { value: country, name: "Country" },
    ];

    // 2) Buscamos cuáles están vacíos
    const missing = requiredFields.filter(field => !field.value.trim()).map(field => field.name);

    if (missing.length > 0) {
      // 3) Mostramos error y abortamos
      ToastError(
        `Por favor completa ${missing.length > 1 ? "los campos" : "el campo"}: ${missing.join(
          ", ",
        )}.`,
      );
      return;
    }

    // 4) Si todo OK, creamos la dirección
    const newAddress = await onCreate(e);

    // 5) Cerramos y reseteamos form
    setAddAddress(false);
    setLabel("");
    setStreet("");
    setApartment("");
    setCity("");
    setRegion("");
    setPostalCode("");
    setCountry("");
    setIsDefault(false);

    // 6) Y marcamos la nueva como default
    if (newAddress) {
      await onSet(newAddress.id);
    }
  };

  return (
    <section aria-labelledby="shipping-heading" className="mt-10">
      <div className="flex items-center justify-between">
        <h2 id="shipping-heading" className="text-lg font-medium text-gray-900">
          Shipping address
        </h2>
        <button
          type="button"
          onClick={() => setAddAddress(prev => !prev)}
          className={`rounded-md px-4 py-2 font-medium transition-colors ${
            addAddress
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : "text-gray-700 hover:bg-gray-300"
          }`}
        >
          {addAddress ? "Cancelar" : "Add address"}
        </button>
      </div>

      {/* Shipping Address Form */}
      {addAddress ? (
        <div>
          <form
            onSubmit={handleCreateSubmit}
            className="mt-6 space-y-4 sm:grid sm:grid-cols-3 sm:gap-x-4 sm:gap-y-4"
          >
            {/* Label */}
            <div className="sm:col-span-3">
              <span className="block text-sm font-medium text-gray-700">Label</span>
              <div className="mt-2">
                <input
                  id="label"
                  name="label"
                  type="text"
                  value={label}
                  onChange={e => setLabel(e.target.value)}
                  required
                  className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 focus:outline-indigo-600 sm:text-sm"
                />
              </div>
            </div>

            {/* Street */}
            <div className="sm:col-span-3">
              <span className="block text-sm font-medium text-gray-700">Street</span>
              <div className="mt-2">
                <input
                  id="street"
                  name="street"
                  type="text"
                  autoComplete="street-address"
                  value={street}
                  onChange={e => setStreet(e.target.value)}
                  required
                  className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 focus:outline-indigo-600 sm:text-sm"
                />
              </div>
            </div>

            {/* Apartment / Suite (opcional) */}
            <div className="sm:col-span-3">
              <span className="block text-sm font-medium text-gray-700">
                Apartment, suite, etc.
              </span>
              <div className="mt-2">
                <input
                  id="apartment"
                  name="apartment"
                  type="text"
                  value={apartment} /* Si tu API no usa este campo, quítalo */
                  onChange={e => setApartment(e.target.value)}
                  required
                  className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 focus:outline-indigo-600 sm:text-sm"
                />
              </div>
            </div>

            {/* City */}
            <div>
              <span className="block text-sm font-medium text-gray-700">City</span>
              <div className="mt-2">
                <input
                  id="city"
                  name="city"
                  type="text"
                  autoComplete="address-level2"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  required
                  className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 focus:outline-indigo-600 sm:text-sm"
                />
              </div>
            </div>

            {/* Region */}
            <div>
              <span className="block text-sm font-medium text-gray-700">State / Province</span>
              <div className="mt-2">
                <input
                  id="region"
                  name="region"
                  type="text"
                  autoComplete="address-level1"
                  value={region}
                  onChange={e => setRegion(e.target.value)}
                  required
                  className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 focus:outline-indigo-600 sm:text-sm"
                />
              </div>
            </div>

            {/* Postal code */}
            <div>
              <span className="block text-sm font-medium text-gray-700">Postal code</span>
              <div className="mt-2">
                <input
                  id="postal-code"
                  name="postal_code"
                  type="text"
                  autoComplete="postal-code"
                  value={postalCode}
                  onChange={e => setPostalCode(e.target.value)}
                  required
                  className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 focus:outline-indigo-600 sm:text-sm"
                />
              </div>
            </div>

            {/* Country */}
            <div>
              <span className="block text-sm font-medium text-gray-700">Country</span>
              <div className="mt-2">
                <select
                  id="country"
                  name="country"
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  required
                  className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 focus:outline-indigo-600 sm:text-sm"
                >
                  {countryOptions.map(({ code, name }) => (
                    <option key={code} value={code}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Is default */}
            <div className="flex items-center sm:col-span-3">
              <input
                id="is-default"
                name="is_default"
                type="checkbox"
                checked={isDefault}
                onChange={e => setIsDefault(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 block text-sm text-gray-900">
                Marcar como dirección predeterminada
              </span>
            </div>

            <Button type="submit" disabled={loadingCreateAddress}>
              {loadingCreateAddress ? <LoadingMoon /> : "Save"}
            </Button>
          </form>
        </div>
      ) : (
        <div className="mt-6">
          {addresses?.length === 0 ? (
            <button
              type="button"
              onClick={() => setAddAddress(prev => !prev)}
              className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
            >
              <TruckIcon className="mx-auto size-12 text-gray-400" />
              <span className="mt-2 block text-sm font-semibold text-gray-900">
                Add a new address
              </span>
            </button>
          ) : (
            <div>
              <fieldset>
                <legend className="text-sm/6 font-semibold text-gray-900">
                  Select a shipping address
                </legend>
                <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4">
                  {addresses.map(address => (
                    <label
                      key={address.id}
                      htmlFor={`shipping-${address.id}`}
                      aria-label={address.label}
                      aria-description={`${address.label} to ${address.user}`}
                      className="group relative flex rounded-lg border border-gray-300 bg-white p-4 has-[:checked]:outline has-[:checked]:outline-2 has-[:checked]:-outline-offset-2 has-[:checked]:outline-indigo-600 has-[:disabled]:border-gray-400 has-[:disabled]:bg-gray-200 has-[:disabled]:opacity-25 has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:-outline-offset-1"
                    >
                      <input
                        value={address.id}
                        defaultChecked={address.is_default}
                        name="shippingAddress"
                        type="radio"
                        onChange={() => onSet(address.id)}
                        className="absolute inset-0 appearance-none focus:outline focus:outline-0"
                      />
                      <div className="flex-1">
                        <span className="block text-sm font-medium text-gray-900">
                          {address.label}
                        </span>
                        <span className="mt-1 block text-sm text-gray-500">
                          {address.street}, {address.city}, {address.region} {address.postal_code}
                        </span>
                        <span className="mt-6 block text-sm font-medium text-gray-900">
                          {address.country}
                        </span>
                      </div>
                      <CheckCircleIcon
                        aria-hidden="true"
                        className="invisible size-5 text-indigo-600 group-has-[:checked]:visible"
                      />
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

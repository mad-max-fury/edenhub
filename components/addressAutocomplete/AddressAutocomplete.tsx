"use client";

import { useRef, useCallback } from "react";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";

const LIBRARIES: ("places")[] = ["places"];

interface AddressResult {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

interface Props {
  value: string;
  onChange: (address: string) => void;
  onSelect: (result: AddressResult) => void;
  placeholder?: string;
  className?: string;
}

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "";

export const AddressAutocomplete = ({
  value,
  onChange,
  onSelect,
  placeholder = "Start typing your address…",
  className,
}: Props) => {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_API_KEY,
    libraries: LIBRARIES,
  });

  const onLoad = useCallback((ac: google.maps.places.Autocomplete) => {
    autocompleteRef.current = ac;
  }, []);

  const onPlaceChanged = useCallback(() => {
    const place = autocompleteRef.current?.getPlace();
    if (!place?.address_components) return;

    const get = (type: string) =>
      place.address_components?.find((c) => c.types.includes(type))
        ?.long_name || "";

    const streetNumber = get("street_number");
    const route = get("route");
    const sublocality = get("sublocality_level_1") || get("sublocality");
    const city =
      get("locality") ||
      get("administrative_area_level_2") ||
      get("sublocality_level_1");
    const state = get("administrative_area_level_1");
    const country = get("country");
    const postalCode = get("postal_code");

    const parts = [streetNumber, route, sublocality].filter(Boolean);
    const address = parts.join(" ") || place.formatted_address || "";

    onChange(address);
    onSelect({ address, city, state, country, postalCode });
  }, [onChange, onSelect]);

  if (!isLoaded || !GOOGLE_API_KEY) {
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={
          className ||
          "w-full border border-N30 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-N200"
        }
      />
    );
  }

  return (
    <Autocomplete
      onLoad={onLoad}
      onPlaceChanged={onPlaceChanged}
      options={{ types: ["address"] }}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={
          className ||
          "w-full border border-N30 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-N200"
        }
      />
    </Autocomplete>
  );
};

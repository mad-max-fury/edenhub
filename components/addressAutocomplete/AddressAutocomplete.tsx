"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

interface AddressResult {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  placeId?: string;
}

interface Props {
  value: string;
  onChange: (address: string) => void;
  onSelect: (result: AddressResult) => void;
  placeholder?: string;
  className?: string;
}

export const AddressAutocomplete = ({
  value,
  onChange,
  onSelect,
  placeholder = "Start typing your address…",
  className = "w-full border border-N30 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-N200",
}: Props) => {
  const places = useMapsLibrary("places");
  const mapDivRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const [autocompleteService, setAutocompleteService] =
    useState<google.maps.places.AutocompleteService | null>(null);
  const [placesService, setPlacesService] =
    useState<google.maps.places.PlacesService | null>(null);
  const [sessionToken, setSessionToken] =
    useState<google.maps.places.AutocompleteSessionToken>();
  const [predictions, setPredictions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!places) return;
    try {
      setAutocompleteService(new places.AutocompleteService());
      if (mapDivRef.current) {
        setPlacesService(new places.PlacesService(mapDivRef.current));
      }
      setSessionToken(new places.AutocompleteSessionToken());
    } catch (err) {
      console.error("Error initializing Places services:", err);
    }
  }, [places]);

  const fetchPredictions = useCallback(
    (input: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (!autocompleteService || !input.trim()) {
        setPredictions([]);
        setShowDropdown(false);
        return;
      }

      setLoading(true);
      debounceRef.current = setTimeout(() => {
        autocompleteService.getPlacePredictions(
          { input, sessionToken },
          (results, status) => {
            setLoading(false);
            if (
              status === google.maps.places.PlacesServiceStatus.OK &&
              results?.length
            ) {
              setPredictions(results);
              setShowDropdown(true);
            } else {
              setPredictions([]);
              setShowDropdown(false);
            }
          },
        );
      }, 300);
    },
    [autocompleteService, sessionToken],
  );

  const handleSelect = useCallback(
    (prediction: google.maps.places.AutocompletePrediction) => {
      if (!placesService) return;

      setShowDropdown(false);
      setPredictions([]);

      placesService.getDetails(
        {
          placeId: prediction.place_id,
          fields: [
            "geometry",
            "name",
            "formatted_address",
            "address_components",
          ],
          sessionToken,
        },
        (place, status) => {
          if (
            status !== google.maps.places.PlacesServiceStatus.OK ||
            !place
          )
            return;

          const get = (type: string) =>
            place.address_components?.find((c) => c.types.includes(type))
              ?.long_name || "";

          const streetNumber = get("street_number");
          const route = get("route");
          const sublocality =
            get("sublocality_level_1") || get("sublocality");
          const city =
            get("locality") ||
            get("administrative_area_level_2") ||
            get("sublocality_level_1");
          const state = get("administrative_area_level_1");
          const country = get("country");
          const postalCode = get("postal_code");

          const parts = [streetNumber, route, sublocality].filter(Boolean);
          const address =
            parts.join(", ") || place.formatted_address || "";

          onChange(address);
          onSelect({
            address,
            city,
            state,
            country,
            postalCode,
            placeId: prediction.place_id,
          });

          if (places) {
            setSessionToken(new places.AutocompleteSessionToken());
          }
        },
      );
    },
    [placesService, sessionToken, places, onChange, onSelect],
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setShowDropdown(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" onClick={(e) => e.stopPropagation()}>
      <div ref={mapDivRef} style={{ display: "none" }} />
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          fetchPredictions(e.target.value);
        }}
        onFocus={() => {
          if (predictions.length > 0) setShowDropdown(true);
        }}
        placeholder={placeholder}
        className={className}
        autoComplete="off"
      />

      {showDropdown && predictions.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-N30 rounded-lg shadow-lg max-h-[240px] overflow-y-auto">
          {loading && (
            <div className="px-4 py-2 text-xs text-N400">Searching…</div>
          )}
          {predictions.map((p) => (
            <button
              key={p.place_id}
              type="button"
              onClick={() => handleSelect(p)}
              className="w-full text-left px-4 py-2.5 hover:bg-N10 transition-colors border-b border-N20 last:border-0"
            >
              <div className="text-sm text-N800">
                {p.structured_formatting.main_text}
              </div>
              <div className="text-xs text-N400">
                {p.structured_formatting.secondary_text}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

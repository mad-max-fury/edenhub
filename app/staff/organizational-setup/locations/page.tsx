"use client";

import React, { useMemo, useState } from "react";
import {
  Button,
  EmptyPageState,
  Modal,
  NetworkError,
  PageHeader,
  PageLoader,
} from "@/components";
import { PAGE_SIZE } from "@/constants/data";
import { useGetAllUnpaginatedCompaniesQuery } from "@/redux/api";
import {
  ICountryProps,
  useGetAllCountriesQuery,
} from "@/redux/api/countryStatesLGA";
import { IApiError } from "@/redux/api/genericInterface";
import { useGetAllLocationsQuery } from "@/redux/api/location";
import { ISelectResponse } from "@/redux/api/select";
import { formatSelectItems } from "@/utils/helpers";
import { useDebounce } from "@/utils/useDebouncedInput";

import { AddOrEditLocation, LocationsTable } from "./components";

const Page = () => {
  const [open, setOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const pageSize = PAGE_SIZE.sm;
  const debouncedInput = useDebounce(searchTerm);
  const query = useMemo(() => {
    return {
      pageNumber,
      searchTerm: debouncedInput,
      pageSize,
    };
  }, [pageNumber, pageSize, debouncedInput]);
  const { data, isLoading, isFetching, error, refetch } =
    useGetAllLocationsQuery(query);
  const { data: countries, isLoading: isLoadingCountries } =
    useGetAllCountriesQuery();
  const { data: companies, isLoading: isLoadingCompanies } =
    useGetAllUnpaginatedCompaniesQuery();

  const allCountries = formatSelectItems<ICountryProps>(
    countries?.data || [],
    "name",
    "id",
  );
  const allCompanies = formatSelectItems<ISelectResponse>(
    companies?.data || [],
    "name",
    "id",
  );

  if (isLoading || isLoadingCountries || isLoadingCompanies)
    return <PageLoader />;
  if (error)
    return (
      <NetworkError
        error={error as IApiError}
        refetch={refetch}
        isFetching={isFetching}
      />
    );
  return (
    <>
      <Modal
        isOpen={open}
        closeModal={() => setOpen(false)}
        title="Add Location"
        mobileLayoutType="full"
      >
        <AddOrEditLocation
          closeModal={() => setOpen(false)}
          allCountries={allCountries}
          allCompanies={allCompanies}
        />
      </Modal>
      {data?.data?.items && (data?.data?.items?.length > 0 || searchTerm) && (
        <>
          <div>
            <PageHeader
              title="Locations"
              buttonGroup={
                <Button variant={"primary"} onClick={() => setOpen(true)}>
                  Add Location
                </Button>
              }
            />
            <div className="mt-6">
              <LocationsTable
                tableData={data?.data}
                pageSize={pageSize}
                searchTerm={searchTerm}
                pageNumber={pageNumber}
                loading={isFetching}
                allCountries={allCountries}
                allCompanies={allCompanies}
                setPageNumber={setPageNumber}
                setSearchTerm={setSearchTerm}
              />
            </div>
          </div>
        </>
      )}
      {data?.data?.items && data?.data?.items?.length === 0 && !searchTerm && (
        <div className="flex h-full items-center justify-center">
          <EmptyPageState
            title="No Locations Added Yet"
            text="Adding locations will help manage employees across different regions."
            buttonGroup={
              <>
                <Button
                  variant={"primary"}
                  className="mx-auto mt-6"
                  onClick={() => setOpen(true)}
                >
                  Add Location
                </Button>
              </>
            }
          />
        </div>
      )}
    </>
  );
};

export default Page;

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
import {
  useGetAllBusinessUnitsQuery,
  useGetAllUnpaginatedCompaniesQuery,
  useGetAllUnpaginatedDepartmentsQuery,
} from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";
import { ISelectResponse } from "@/redux/api/select";
import { formatSelectItems } from "@/utils/helpers";
import { useDebounce } from "@/utils/useDebouncedInput";

import { AddOrEditBusinesses, Table } from "./components";

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
    useGetAllBusinessUnitsQuery(query);
  const { data: companies, isLoading: isLoadingCompanies } =
    useGetAllUnpaginatedCompaniesQuery();
  const { data: departments, isLoading: isLoadingDepartments } =
    useGetAllUnpaginatedDepartmentsQuery({});
  const allCompanies = formatSelectItems<ISelectResponse>(
    companies?.data || [],
    "name",
    "id",
  );
  const allDepartments = formatSelectItems<ISelectResponse>(
    departments?.data || [],
    "name",
    "id",
  );
  if (isLoading || isLoadingCompanies || isLoadingDepartments)
    return <PageLoader />;
  if (error)
    return (
      <NetworkError
        error={error as IApiError}
        isFetching={isFetching}
        refetch={refetch}
      />
    );
  return (
    <>
      <Modal
        isOpen={open}
        closeModal={() => setOpen(false)}
        title="Add Business Unit"
        mobileLayoutType="full"
      >
        <AddOrEditBusinesses
          closeModal={() => setOpen(false)}
          allCompanies={allCompanies}
          allDepartments={allDepartments}
        />
      </Modal>
      {data?.data?.items && (data?.data?.items?.length > 0 || searchTerm) && (
        <div>
          <PageHeader
            title="Business Units"
            buttonGroup={
              <Button variant={"primary"} onClick={() => setOpen(true)}>
                Add Business Unit
              </Button>
            }
          />
          <div className="mt-6">
            <Table
              tableData={data?.data}
              pageSize={pageSize}
              searchTerm={searchTerm}
              pageNumber={pageNumber}
              loading={isFetching}
              setPageNumber={setPageNumber}
              setSearchTerm={setSearchTerm}
              allCompanies={allCompanies}
              allDepartments={allDepartments}
            />
          </div>
        </div>
      )}
      {data?.data?.items && data?.data?.items?.length === 0 && !searchTerm && (
        <div className="flex h-full items-center justify-center">
          <EmptyPageState
            title="Manage Your Teams"
            text="No Business unit added currently"
            buttonGroup={
              <>
                <Button
                  variant={"primary"}
                  className="mx-auto mt-6"
                  onClick={() => setOpen(true)}
                >
                  Add Business Units
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

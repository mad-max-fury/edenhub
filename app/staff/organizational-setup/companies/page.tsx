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
import { useGetAllCompaniesQuery } from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";
import { useDebounce } from "@/utils/useDebouncedInput";

import { AddOrEditCompanies, CompaniesTable } from "./components";

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
    useGetAllCompaniesQuery(query);

  if (isLoading) return <PageLoader />;
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
        title="Add Company"
        mobileLayoutType="full"
      >
        <AddOrEditCompanies closeModal={() => setOpen(false)} />
      </Modal>
      {data?.data?.items && (data?.data?.items?.length > 0 || searchTerm) && (
        <>
          <div>
            <PageHeader
              title="Companies"
              buttonGroup={
                <Button variant={"primary"} onClick={() => setOpen(true)}>
                  Add Company
                </Button>
              }
            />
            <div className="mt-6">
              <CompaniesTable
                tableData={data?.data}
                pageSize={pageSize}
                searchTerm={searchTerm}
                pageNumber={pageNumber}
                loading={isFetching}
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
            title="No Companies"
            text="No companies added currently. Add all the companies associated with
          your organization"
            buttonGroup={
              <>
                <Button
                  variant={"primary"}
                  className="mx-auto mt-6"
                  onClick={() => setOpen(true)}
                >
                  Add Company
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

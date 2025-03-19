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
import { useGetAllJobDesignationsQuery } from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";
import { useDebounce } from "@/utils/useDebouncedInput";

import {
  AddOrEditJobDesignations,
  ImportJobDesignations,
  Table,
} from "./components";

const Page = () => {
  const [open, setOpen] = useState(false);
  const [openImport, setOpenImport] = useState(false);
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
    useGetAllJobDesignationsQuery(query);

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
        title="Add Job Designations"
        mobileLayoutType="full"
      >
        <AddOrEditJobDesignations closeModal={() => setOpen(false)} />
      </Modal>
      <Modal
        isOpen={openImport}
        closeModal={() => setOpenImport(false)}
        title="Import Designations"
        mobileLayoutType="full"
      >
        <ImportJobDesignations closeModal={() => setOpenImport(false)} />
      </Modal>
      {data?.data?.items && (data?.data?.items?.length > 0 || searchTerm) && (
        <>
          <div>
            <PageHeader
              title="Job Designations"
              buttonGroup={
                <div className="flex gap-1">
                  <Button variant={"primary"} onClick={() => setOpen(true)}>
                    Add Designation
                  </Button>
                  <Button
                    variant={"secondary"}
                    onClick={() => setOpenImport(true)}
                  >
                    Import
                  </Button>
                </div>
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
              />
            </div>
          </div>
        </>
      )}
      {data?.data?.items && data?.data?.items?.length === 0 && !searchTerm && (
        <div className="flex h-full items-center justify-center">
          <EmptyPageState
            title="No Job Designations Defined Yet"
            text=" Adding job titles will help manage roles, responsibilities, and compensation"
            buttonGroup={
              <div className="mt-6 flex justify-center gap-1">
                <Button variant={"primary"} onClick={() => setOpen(true)}>
                  Add Designations
                </Button>
                <Button
                  variant={"secondary"}
                  onClick={() => setOpenImport(true)}
                >
                  Import Designations
                </Button>
              </div>
            }
          />
        </div>
      )}
    </>
  );
};

export default Page;

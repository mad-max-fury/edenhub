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
import { useGetAllDepartmentsQuery } from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";
import { useDebounce } from "@/utils/useDebouncedInput";

import { AddOrEditDepartment, DepartmentTable } from "./components";
import { ImportDepartments } from "./components/ImportDepartments";

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
    useGetAllDepartmentsQuery(query);

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
        title="Add Department"
        mobileLayoutType="full"
      >
        <AddOrEditDepartment closeModal={() => setOpen(false)} />
      </Modal>
      <Modal
        isOpen={openImport}
        closeModal={() => setOpenImport(false)}
        title="Import Departments"
        mobileLayoutType="full"
      >
        <ImportDepartments closeModal={() => setOpenImport(false)} />
      </Modal>
      {data?.data?.items && (data?.data?.items?.length > 0 || searchTerm) && (
        <>
          <div>
            <PageHeader
              title="Departments"
              buttonGroup={
                <div className="flex gap-1">
                  <Button variant={"primary"} onClick={() => setOpen(true)}>
                    Add Department
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
              <DepartmentTable
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
            title="Manage Your Teams"
            text="No departments added currently. Create Departments to Organize Employees."
            buttonGroup={
              <div className="mt-6 flex justify-center gap-1">
                <Button
                  variant={"primary"}
                  className="mx-auto mt-6"
                  onClick={() => setOpen(true)}
                >
                  Add Departments
                </Button>
                <Button
                  variant={"secondary"}
                  onClick={() => setOpenImport(true)}
                >
                  Import Departments
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

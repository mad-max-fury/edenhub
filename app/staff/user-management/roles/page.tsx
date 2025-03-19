"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Button, NetworkError, PageHeader, PageLoader } from "@/components";
import { PAGE_SIZE } from "@/constants/data";
import { AuthRouteConfig } from "@/constants/routes";
import { IPaginatedRolesResponse, useGetAllRolesQuery } from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";
import { useDebounce } from "@/utils/useDebouncedInput";

import { RolesTable } from "./components";

const Page = () => {
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
    useGetAllRolesQuery(query);

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
      <div>
        <PageHeader
          title="Roles"
          buttonGroup={
            <Link href={AuthRouteConfig.USER_MANAGEMENT_ROLES_CREATE}>
              <Button>Add Roles</Button>
            </Link>
          }
        />
        <div className="mt-12">
          <RolesTable
            tableData={data?.data as IPaginatedRolesResponse}
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
  );
};

export default Page;

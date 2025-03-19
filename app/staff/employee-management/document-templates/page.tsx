"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Button,
  EmptyPageState,
  NetworkError,
  PageHeader,
  PageLoader,
} from "@/components";
import { PAGE_SIZE } from "@/constants/data";
import { AuthRouteConfig } from "@/constants/routes";
import {
  IPaginatedDocumntTemplateResponse,
  useGetAllDocumentTemplateQuery,
} from "@/redux/api/documentTemplate";
import { clearDocumentTemplateForm } from "@/redux/api/documentTemplate/document.slice";
import { IApiError, Response } from "@/redux/api/genericInterface";
import { useDebounce } from "@/utils/useDebouncedInput";
import { useDispatch } from "react-redux";

import { DocumentTemplateTable } from "./components/DocumentTemplateTable";

const Page = () => {
  const pageSize = PAGE_SIZE.sm;
  const [isMountedCounted, setIsMountedCounted] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedInput = useDebounce(searchTerm);
  const dispatch = useDispatch();
  const query = useMemo(() => {
    return {
      pageNumber,
      searchTerm: debouncedInput,
      pageSize,
    };
  }, [pageNumber, pageSize, debouncedInput]);

  const { data, error, isLoading, refetch, isFetching } =
    useGetAllDocumentTemplateQuery(query);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      setIsMountedCounted(isMountedCounted + 1);
    }
    () => (mounted = false);
  }, [isFetching]);

  if (isLoading) return <PageLoader />;
  if (error)
    return (
      <NetworkError
        error={error as IApiError}
        refetch={refetch}
        isFetching={isFetching}
      />
    );
  const hasNoData = (data?.data?.items?.length as number) < 1;

  return (
    <>
      {isMountedCounted <= 2 && hasNoData ? (
        <div className="flex h-full items-center justify-center">
          <EmptyPageState
            title="No Document Template"
            text="There are currently no templates available. Would you like to create a new document from scratch?"
            buttonGroup={
              <Link href={AuthRouteConfig.EMPLOYEE_MANAGEMENT_DOCUMENT_CREATE}>
                <Button
                  onClick={() => {
                    dispatch(clearDocumentTemplateForm());
                  }}
                  variant={"primary"}
                  className="mx-auto mt-6"
                >
                  Create Document Template
                </Button>
              </Link>
            }
          />
        </div>
      ) : (
        <>
          <div>
            <PageHeader
              title="Documents"
              buttonGroup={
                <Link
                  href={AuthRouteConfig.EMPLOYEE_MANAGEMENT_DOCUMENT_CREATE}
                >
                  <Button
                    onClick={() => {
                      dispatch(clearDocumentTemplateForm());
                    }}
                    variant={"primary"}
                  >
                    {" "}
                    Create Document Template
                  </Button>
                </Link>
              }
            />

            <div className="mt-6">
              <DocumentTemplateTable
                tableData={
                  (data as Response<IPaginatedDocumntTemplateResponse>).data
                }
                pageSize={pageSize}
                searchTerm={searchTerm}
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
                setSearchTerm={setSearchTerm}
                loading={isFetching}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Page;

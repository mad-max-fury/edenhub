"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Button,
  EmptyPageState,
  Modal,
  NetworkError,
  PageHeader,
  PageLoader,
} from "@/components";
import { PAGE_SIZE } from "@/constants/data";
import { IApiError, Response } from "@/redux/api/genericInterface";
import {
  IPaginatedLeaveTypesResponse,
  useGetAllLeaveTypesQuery,
} from "@/redux/api/leave";
import {
  useGetLeaveCategoryQuery,
  useGetLeaveDaysOptionsQuery,
} from "@/redux/api/select";
import { useDebounce } from "@/utils/useDebouncedInput";

import { AddOrEditLeaveType } from "./components/addOrEditLeaveType";
import { LeaveTable } from "./components/LeaveTable";

const LeaveTypesPage = () => {
  const pageSize = PAGE_SIZE.sm;
  const [isMountedCounted, setIsMountedCounted] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const debouncedInput = useDebounce(searchTerm);

  const query = useMemo(() => {
    return {
      pageNumber,
      searchTerm: debouncedInput,
      pageSize,
    };
  }, [pageNumber, pageSize, debouncedInput]);

  const { data: leaveTypesId, isLoading: isLoadingLeaveTypesId } =
    useGetLeaveCategoryQuery();
  const { data: leaveDaysOptions, isLoading: isLoadingLeaveDaysOptions } =
    useGetLeaveDaysOptionsQuery();

  const { data, error, isLoading, refetch, isFetching } =
    useGetAllLeaveTypesQuery(query);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      setIsMountedCounted(isMountedCounted + 1);
    }
    () => (mounted = false);
  }, [isFetching]);

  if (isLoading || isLoadingLeaveDaysOptions || isLoadingLeaveTypesId)
    return <PageLoader />;
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
      <Modal
        isOpen={open}
        closeModal={() => setOpen(false)}
        title="Add Leave Type"
        mobileLayoutType="full"
      >
        <AddOrEditLeaveType
          leaveDaysOptions={leaveDaysOptions?.data || []}
          leaveTypesId={leaveTypesId?.data || []}
          closeModal={() => setOpen(false)}
        />
      </Modal>
      {isMountedCounted <= 2 && hasNoData ? (
        <div className="flex h-full items-center justify-center">
          <EmptyPageState
            title="No Leave Types"
            text="No leave types added currently. Add all the leave types associated with your organization "
            buttonGroup={
              <Button
                onClick={() => {
                  setOpen(true);
                }}
                variant={"primary"}
                className="mx-auto mt-6"
              >
                Add Leave Type
              </Button>
            }
          />
        </div>
      ) : (
        <>
          <div>
            <PageHeader
              title="Leave Type"
              buttonGroup={
                <Button
                  onClick={() => {
                    setOpen(true);
                  }}
                  variant={"primary"}
                >
                  Add Leave Type
                </Button>
              }
            />

            <div className="mt-6">
              <LeaveTable
                tableData={
                  (data as Response<IPaginatedLeaveTypesResponse>).data
                }
                pageSize={pageSize}
                searchTerm={searchTerm}
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
                setSearchTerm={setSearchTerm}
                loading={isFetching}
                leaveDaysOptions={leaveDaysOptions?.data ?? []}
                leaveTypesId={leaveTypesId?.data ?? []}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default LeaveTypesPage;

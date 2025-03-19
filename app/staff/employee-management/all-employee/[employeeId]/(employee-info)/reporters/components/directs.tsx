import React, { useState } from "react";
import {
  Avatar,
  EmptyPageState,
  ExtendedColumn,
  Jumbotron,
  TMTable,
  Typography,
} from "@/components";
import { PAGE_SIZE } from "@/constants/data";
import {
  IDirectReportsResponse,
  useGetDirectReportsQuery,
  WHO_AM_I,
} from "@/redux/api";
import { cn } from "@/utils/helpers";

interface IDirectReportsProps {
  reviewId: string;
  empId: string;
  year: number;
  title?: string;
}

const DirectsReports = ({ reviewId, empId, year }: IDirectReportsProps) => {
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = PAGE_SIZE.xs;
  const { data, isLoading: isLoadingAppraiserOrHOD } = useGetDirectReportsQuery(
    {
      reviewId,
      employeeId: empId,
      whoami: WHO_AM_I.appraiser,
      pageNumber,
      pageSize,
      year,
    },
    {
      skip: !(reviewId && empId),
    },
  );
  const columns: ExtendedColumn<IDirectReportsResponse>[] = React.useMemo(
    () => [
      {
        Header: "Full Name",
        Cell: ({ cell: { row } }) => {
          return (
            <div className="flex w-fit items-center gap-2">
              <Avatar
                fullname={
                  row.original.employeeDetail.fullName ??
                  row.original.employeeDetail.name
                }
                size="sm"
                src={row.original.employeeDetail.profilePicture}
              />
              <div className="flex flex-col">
                <span className="font-medium text-N900">
                  {row.original.employeeDetail.fullName ??
                    row.original.employeeDetail.name}
                </span>
                <span className="text-xs text-N100">
                  {row.original.employeeDetail.email}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        Header: "Department",
        Cell: ({ cell: { row } }) => {
          return <>{row.original.employeeDetail.department ?? "-"}</>;
        },
      },
    ],
    [],
  );
  return (
    <div className={cn("ml-auto max-w-[935px] pb-6")}>
      <Jumbotron
        headerContainer={
          <div className="flex justify-between">
            <Typography variant="h-m" color="text-default">
              Direct Reports
            </Typography>
          </div>
        }
      >
        <div className={cn("w-full")}>
          {data?.data?.directReport && data?.data?.directReport.length < 1 ? (
            <div className="flex min-h-[380px] w-full items-center justify-center px-5">
              <EmptyPageState
                title="No Direct Reports"
                text={`This employee has no direct reports`}
              />
            </div>
          ) : (
            <TMTable
              columns={columns}
              data={data?.data?.directReport ?? []}
              loading={isLoadingAppraiserOrHOD}
              className="border-0"
              setPageNumber={setPageNumber}
            />
          )}
        </div>
      </Jumbotron>
    </div>
  );
};

export { DirectsReports };

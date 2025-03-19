import React, { useState } from "react";
import { Avatar, ExtendedColumn, TMTable } from "@/components";
import { PAGE_SIZE } from "@/constants/data";
import {
  IDirectReportsResponse,
  useGetDirectReportsQuery,
  WHO_AM_I,
} from "@/redux/api";

import { IDirectReportsProps } from "./DirectReports";

interface DirectReportsTableProps extends IDirectReportsProps {
  whoami: WHO_AM_I;
}

export const DirectReportsTable = ({
  reviewId,
  empId,
  whoami,
  year,
}: DirectReportsTableProps) => {
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = PAGE_SIZE.xs;
  const { data, isLoading: isLoadingAppraiserOrHOD } = useGetDirectReportsQuery(
    {
      reviewId,
      employeeId: empId,
      whoami,
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
        Header: "Name",
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
    <div>
      <TMTable
        columns={columns}
        data={data?.data?.directReport ?? []}
        loading={isLoadingAppraiserOrHOD}
        className="border-0 border-t"
        setPageNumber={setPageNumber}
      />
    </div>
  );
};

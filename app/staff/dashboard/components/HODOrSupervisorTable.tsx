import React from "react";
import { Avatar, ExtendedColumn, TMTable } from "@/components";
import {
  IHODOrSupervisorResponse,
  useGetAppraiserOrHODQuery,
  WHO_AM_I,
} from "@/redux/api";

import { IDirectReportsProps } from "./DirectReports";

interface DirectReportsTableProps extends IDirectReportsProps {
  whoami: WHO_AM_I;
}

export const HODOrSupervisorTable = ({
  reviewId,
  empId,
  whoami,
  year,
}: DirectReportsTableProps) => {
  const { data: hodOrAppraisewr, isFetching: isLoadingAppraiserOrHOD } =
    useGetAppraiserOrHODQuery(
      {
        reviewId,
        empId,
        whoami,
        year,
      },
      {
        skip: !(reviewId && empId),
      },
    );

  const columns: ExtendedColumn<IHODOrSupervisorResponse>[] = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        Cell: ({ cell: { row } }) => {
          return (
            <div className="flex w-fit items-center gap-2">
              <Avatar
                fullname={row.original.fullName ?? row.original.name}
                size="sm"
                src={row.original.profilePicture}
              />
              <div className="flex flex-col">
                <span className="font-medium text-N900">
                  {row.original.fullName ?? row.original.name}
                </span>
                <span className="text-xs text-N100">{row.original.email}</span>
              </div>
            </div>
          );
        },
      },
      {
        Header: "Department",
        accessor: "department",
      },
    ],
    [],
  );

  return (
    <div>
      <TMTable
        columns={columns}
        data={hodOrAppraisewr?.data ?? []}
        loading={isLoadingAppraiserOrHOD}
        className="border-0 border-t"
      />
    </div>
  );
};

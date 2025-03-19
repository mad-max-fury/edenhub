import React from "react";
import { Avatar, ExtendedColumn, TMTable } from "@/components";
import { IWorkAnniversaryProps } from "@/redux/api";
import { formatDateToShortForm } from "@/utils/helpers";

interface IWorkAnniversaryTable {
  data: IWorkAnniversaryProps[];
}

export const UpcomingWorkAnniversaryTable: React.FC<IWorkAnniversaryTable> = ({
  data,
}) => {
  const columns: ExtendedColumn<IWorkAnniversaryProps>[] = React.useMemo(
    () => [
      {
        Header: "Name",
        Cell: ({ cell: { row } }) => {
          return (
            <div className="flex w-fit items-center gap-2">
              <Avatar
                fullname={`${row.original.firstname} ${row.original.lastname}`}
                size="sm"
                src={row.original.profilePicture}
              />
              <div className="flex flex-col">
                <span className="font-medium text-N900">
                  {`${row.original.firstname} ${row.original.lastname}`}
                </span>
                <span className="text-xs text-N100">
                  {row.original.department}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        Header: "Company",
        accessor: "company",
      },
      {
        Header: "Date",
        accessor: "hiredDate",
        Cell: ({ cell: { row } }) => {
          return <>{formatDateToShortForm(row.original.hiredDate) ?? "-"}</>;
        },
      },
    ],
    [],
  );

  return (
    <div>
      <TMTable
        columns={columns}
        data={data}
        title="Upcoming Work Anniversary"
        loading={false}
      />
    </div>
  );
};

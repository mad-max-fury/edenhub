import React from "react";
import { Avatar, ExtendedColumn, TMTable } from "@/components";
import { IBirthdayResponse } from "@/redux/api";
import { formatDateToShortForm } from "@/utils/helpers";

interface IBirthdayTable {
  data: IBirthdayResponse[];
}

export const UpcomingBirthdayTable: React.FC<IBirthdayTable> = ({ data }) => {
  const columns: ExtendedColumn<IBirthdayResponse>[] = React.useMemo(
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
        Cell: ({ cell: { row } }) => {
          return <>{row.original.company ?? "-"}</>;
        },
      },
      {
        Header: "Date",
        accessor: "birthDay",
        Cell: ({ cell: { row } }) => {
          return <>{formatDateToShortForm(row.original.birthDay) ?? "-"}</>;
        },
      },
    ],
    [],
  );

  return (
    <div>
      <TMTable<IBirthdayResponse>
        columns={columns}
        data={data}
        title="Upcoming Birthdays 🎂"
        loading={false}
      />
    </div>
  );
};

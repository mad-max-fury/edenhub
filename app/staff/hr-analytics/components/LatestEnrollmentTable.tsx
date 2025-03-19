import React from "react";
import Link from "next/link";
import {
  Avatar,
  Badge,
  ExtendedColumn,
  TMTable,
  Typography,
} from "@/components";
import { AuthRouteConfig } from "@/constants/routes";
import { ILatestEnrorllmentProps } from "@/redux/api";
import { getEnrollmentBadgeVariant } from "@/utils/helpers";

interface IEnrollmentTable {
  data: ILatestEnrorllmentProps[];
}

export const LatestEnrollmentTable: React.FC<IEnrollmentTable> = ({ data }) => {
  const columns: ExtendedColumn<ILatestEnrorllmentProps>[] = React.useMemo(
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
        Header: "Enrollment",
        Cell: ({ cell: { row } }) => {
          return (
            <Badge
              variant={getEnrollmentBadgeVariant(row.original.status)}
              text={row.original.status}
            />
          );
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
        title="Latest Enrollment"
        additionalTitleData={
          <Link href={AuthRouteConfig.EMPLOYEE_MANAGEMENT_ENROLLMENT}>
            <Typography
              variant="p-m"
              fontWeight="bold"
              color="B400"
              className="cursor-pointer"
            >
              View All
            </Typography>
          </Link>
        }
        loading={false}
      />
    </div>
  );
};

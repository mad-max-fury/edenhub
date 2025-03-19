import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Avatar,
  Badge,
  ExtendedColumn,
  TMTable,
  Typography,
} from "@/components";
import { PAGE_SIZE } from "@/constants/data";
import { AuthRouteConfig } from "@/constants/routes";
import {
  IGetEmployeeLeaveItem,
  IGetEmployeeLeavesRequest,
  MetaData,
  useGetEmployeeLeaveApplicationsQuery,
} from "@/redux/api";
import { getLeaveApprovalStatusBadgeVariant } from "@/utils/helpers";

export const LeaveApplicationsTable = () => {
  const [internalPageNumber, setInternalPageNumber] = useState(1);

  const filter: IGetEmployeeLeavesRequest = useMemo(
    () => ({
      pageNumber: internalPageNumber,
      pageSize: PAGE_SIZE.xs,
      searchTerm: "",
      statusId: "",
      yearId: "",
      leaveTypeId: "",
      departmentId: "",
      companyId: "",
    }),
    [internalPageNumber],
  );
  const setPageNumber = (page: number) => setInternalPageNumber(page);

  const { data: employeeLeavesData, isLoading, isFetching } =
    useGetEmployeeLeaveApplicationsQuery(filter);

  const columns: ExtendedColumn<IGetEmployeeLeaveItem>[] = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        Cell: ({ cell: { row } }) => {
          return (
            <div className="flex w-[200px] items-center gap-2">
              <Avatar
                fullname={row.original.employeeName}
                size="sm"
                src={row.original.profilePicture}
              />
              <div className="flex flex-col">
                <span>{row.original.employeeName}</span>
                <span className="text-xs text-gray-400">
                  {row.original.employeeEmail}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        Header: "Counts",
        Cell: ({ cell: { row } }) => {
          const label = row.original?.numberOfDays === 1 ? "day" : "days";
          return (
            <div className="flex items-center">{`${row.original.numberOfDays} ${label}`}</div>
          );
        },
      },
      {
        Header: "Approval",
        id: "supervisorApproval",
        accessor: "approval",
        Cell: ({ cell: { row } }) => {
          return (
            <Badge
              variant={getLeaveApprovalStatusBadgeVariant(
                row.original.approval,
              )}
              text={row.original.approval}
            />
          );
        },
      },
      // },
    ],
    [],
  );

  return (
    <div>
      <TMTable<IGetEmployeeLeaveItem>
        columns={columns}
        data={employeeLeavesData?.data.items || []}
        title="Latest Leave Applications"
        isServerSidePagination={true}
        availablePages={employeeLeavesData?.data?.metaData?.totalPages || 1}
        setPageNumber={setPageNumber}
        loading={isLoading || isFetching}
        metaData={employeeLeavesData?.data?.metaData as MetaData}
        additionalTitleData={
          <Link href={AuthRouteConfig.STAFF_LEAVE_REQUESTS}>
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
      />
    </div>
  );
};

"use client";

import React, { useContext, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Badge,
  ButtonDropdown,
  EmptyPageState,
  ExtendedColumn,
  OptionType,
  Search,
  SMSelectDropDown,
  TMTable,
} from "@/components";
import { PAGE_SIZE, SEARCH_DELAY } from "@/constants/data";
import { AuthRouteConfig } from "@/constants/routes";
import { UserContext } from "@/layouts/appLayout";
import {
  IGetEmployeeLeaveItem,
  IGetEmployeeLeavesRequest,
  ILeaveProps,
  MetaData,
  useGetAllUnpaginatedLeaveTypesQuery,
  useGetTeamLeaveApplicationsQuery,
} from "@/redux/api";
import { ISelectItemPropsWithValueGeneric } from "@/redux/api/interface";
import { ISelectResponse, useGetAllYearsQuery } from "@/redux/api/select";
import {
  formatDate,
  formatSelectItems,
  getLeaveApprovalStatusBadgeVariant,
} from "@/utils/helpers";
import { useDebounce } from "@/utils/useDebouncedInput";

interface IComponentProps {
  staff: "hod" | "supervisor";
}
interface ITableData {
  employeeLeavesData:
    | {
        data: {
          items: IGetEmployeeLeaveItem[];
          metaData: {
            totalPages: number;
          };
        };
      }
    | undefined;
  leaveTypes: { data: ISelectItemPropsWithValueGeneric[] } | undefined;
  years: { data: ISelectResponse[] } | undefined;
  statuses: { data: ISelectResponse[] } | undefined;
  isLoading: boolean;
}

const useTableData = (filter: IGetEmployeeLeavesRequest): ITableData => {
  const {
    data: employeeLeavesData,
    isLoading,
    isFetching,
  } = useGetTeamLeaveApplicationsQuery(filter);
  const { data: years } = useGetAllYearsQuery();
  const { data: leaveTypes } = useGetAllUnpaginatedLeaveTypesQuery();

  const allLeaveTypes = formatSelectItems<ILeaveProps>(
    leaveTypes?.data || [],
    "name",
    "leaveId",
  );

  return {
    employeeLeavesData,
    years,
    leaveTypes: {
      data: allLeaveTypes,
    },
    statuses: {
      data: [
        {
          id: "true",
          name: "Approved",
        },
        {
          id: "false",
          name: "Rejected",
        },
        {
          name: "pending",
          id: "pending",
        },
      ],
    },
    isLoading: isLoading || isFetching,
  };
};

export const TeamsLeaveTable = ({ staff }: IComponentProps) => {
  const user = useContext(UserContext);
  const router = useRouter();
  const [internalSearchInput, setInternalSearchInput] = useState("");
  const [internalStatusId, setInternalStatusId] = useState("");
  const [internalYearId, setInternalYearId] = useState("");
  const [internalLeaveTypeId, setInternalLeaveTypeId] = useState("");
  const [internalPageNumber, setInternalPageNumber] = useState(1);

  const debouncedSearchTerm = useDebounce(internalSearchInput, SEARCH_DELAY.sm);

  const filter: IGetEmployeeLeavesRequest = useMemo(
    () => ({
      pageNumber: internalPageNumber,
      pageSize: PAGE_SIZE.md,
      searchTerm: debouncedSearchTerm,
      statusId: internalStatusId,
      yearId: internalYearId,
      leaveTypeId: internalLeaveTypeId,
      employeeId: user?.user?.employeeId as string,
    }),
    [
      internalPageNumber,
      debouncedSearchTerm,
      internalStatusId,
      internalYearId,
      internalLeaveTypeId,
      user?.user,
    ],
  );

  const { employeeLeavesData, years, leaveTypes, statuses, isLoading } =
    useTableData(filter);

  const handleSearch = (value: string) => setInternalSearchInput(value);

  const handleSelectChange =
    (key: string) => (selectedOption: OptionType | null) => {
      switch (key) {
        case "status":
          setInternalStatusId((selectedOption?.value as string) || "");
          break;
        case "year":
          setInternalYearId((selectedOption?.value as string) || "");
          break;
        case "leaveType":
          setInternalLeaveTypeId((selectedOption?.value as string) || "");
          break;
      }
      setInternalPageNumber(1);
    };

  const setPageNumber = (page: number) => setInternalPageNumber(page);

  const columns: ExtendedColumn<IGetEmployeeLeaveItem>[] = useMemo(
    () => [
      {
        Header: "Full Name",
        Cell: ({ cell: { row } }) => (
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
        ),
      },
      {
        Header: "Type of Leave",
        accessor: "name",
      },
      {
        Header: "Leave Duration",
        accessor: "from",
        Cell: ({ cell: { row } }) => {
          return (
            <div className="flex items-center">
              {row?.original?.from && formatDate(row?.original.from)} -{" "}
              {row?.original?.to && formatDate(row?.original.to)}
            </div>
          );
        },
      },
      {
        Header: "Counts",
        accessor: "numberOfDays",
        Cell: ({ cell: { value } }) => {
          const label = value === 1 ? "day" : "days";
          return <div className="flex items-center">{`${value} ${label}`}</div>;
        },
      },
      {
        Header: "Date Applied",
        accessor: "dateApplied",
        Cell: ({ cell: { value } }) => (
          <div className="flex items-center">{formatDate(value) ?? "_"}</div>
        ),
      },
      {
        Header: "Status",
        accessor: "approval",
        Cell: ({ cell: { value } }) => (
          <div className="flex items-center">
            {value ? (
              <Badge
                variant={getLeaveApprovalStatusBadgeVariant(value ?? "Pending")}
                text={value ?? "Pending"}
              />
            ) : (
              "--"
            )}
          </div>
        ),
      },
      {
        Header: "Action",
        id: "action",
        Cell: ({ cell: { row } }) => {
          const buttonGroup = [
            {
              name: "View details",
              onClick: () =>
                router.push(`
                  ${
                    staff === "hod"
                      ? AuthRouteConfig.STAFF_LEAVE_MY_TEAMS
                      : AuthRouteConfig.STAFF_LEAVE_MY_DIRECT_REPORT
                  }/${row.original.leaveId}`),
            },
          ];
          return <ButtonDropdown buttonGroup={buttonGroup} />;
        },
      },
    ],
    [router, staff],
  );

  const renderFilters = () => (
    <div className="mb-4">
      <div className="flex items-center gap-2">
        <div className="w-full max-w-[260px]">
          <Search
            placeholder="Search"
            onChange={(e) => handleSearch(e.target.value)}
            value={internalSearchInput}
          />
        </div>
        <div className="grid grid-cols-3 gap-2 [&>*]:w-full">
          <SMSelectDropDown
            options={[
              { label: "All years", value: "" },
              ...(years?.data
                ? formatSelectItems<ISelectResponse>(years.data, "name", "id")
                : []),
            ]}
            varient="simple"
            onChange={handleSelectChange("year")}
            placeholder="Select year"
            searchable={true}
            value={
              [
                { label: "All years", value: "" },
                ...(years?.data
                  ? formatSelectItems<ISelectResponse>(years.data, "name", "id")
                  : []),
              ].find((year) => year.value === internalYearId) || null
            }
            bgColor
          />
          <SMSelectDropDown
            options={[
              { label: "All Statuses", value: "" },
              ...(statuses?.data
                ? formatSelectItems<ISelectResponse>(
                    statuses.data,
                    "name",
                    "id",
                  )
                : []),
            ]}
            varient="simple"
            onChange={handleSelectChange("status")}
            placeholder="Select Status"
            searchable={true}
            value={
              [
                { label: "All Statuses", value: "" },
                ...(statuses?.data
                  ? formatSelectItems<ISelectResponse>(
                      statuses.data,
                      "name",
                      "id",
                    )
                  : []),
              ].find((status) => status.value === internalStatusId) || null
            }
            bgColor
          />
          <SMSelectDropDown
            options={[
              { label: "All Leave types", value: "" },
              ...(leaveTypes?.data ? leaveTypes.data : []),
            ]}
            varient="simple"
            onChange={handleSelectChange("leaveType")}
            placeholder="Select leave type"
            searchable={true}
            value={
              [
                { label: "All leave types", value: "" },
                ...(leaveTypes?.data ? leaveTypes.data : []),
              ].find((leaveType) => leaveType.value === internalLeaveTypeId) || null
            }
            bgColor
          />
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {renderFilters()}
      {employeeLeavesData?.data?.items &&
        employeeLeavesData?.data?.items?.length === 0 &&
        !internalSearchInput && (
          <div className="flex h-screen items-center justify-center">
            <EmptyPageState
              title={"No Direct Reports"}
              text="None of your direct reports has submitted their leave application."
            />
          </div>
        )}
      <TMTable<IGetEmployeeLeaveItem>
        columns={columns}
        data={employeeLeavesData?.data.items || []}
        title={staff === "hod" ? "My Team" : "My Direct Reports"}
        availablePages={employeeLeavesData?.data?.metaData?.totalPages || 1}
        setPageNumber={setPageNumber}
        loading={isLoading}
        isServerSidePagination={true}
        metaData={employeeLeavesData?.data?.metaData as MetaData}
      />
    </div>
  );
};

"use client";

import React, { useMemo, useState } from "react";
import {
  Avatar,
  Badge,
  ButtonDropdown,
  ButtonDropdownItem,
  EmptyPageState,
  ExtendedColumn,
  Modal,
  OptionType,
  PageHeader,
  Search,
  SMSelectDropDown,
  TMTable,
  Typography,
  ViewEmployeeLeaveDetails,
} from "@/components";
import { PAGE_SIZE, SEARCH_DELAY } from "@/constants/data";
import {
  IGetEmployeeLeaveItem,
  IGetEmployeeLeavesRequest,
  ILeaveProps,
  MetaData,
  useGetAllUnpaginatedCompaniesQuery,
  useGetAllUnpaginatedDepartmentsQuery,
  useGetAllUnpaginatedLeaveTypesQuery,
  useGetEmployeeLeaveApplicationsQuery,
  useGetLeaveApplicationDetailsQuery,
} from "@/redux/api";
import { ISelectItemPropsWithValueGeneric } from "@/redux/api/interface";
import { ISelectResponse } from "@/redux/api/select";
import {
  formatDate,
  formatSelectItems,
  getLeaveApprovalStatusBadgeVariant,
} from "@/utils/helpers";
import { useDebounce } from "@/utils/useDebouncedInput";

interface ActionCellProps {
  row: { original: IGetEmployeeLeaveItem };
  handleSetRowAction: (rowAction: {
    row: IGetEmployeeLeaveItem;
    action: "view" | "delete";
  }) => void;
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
  statuses: { data: ISelectResponse[] } | undefined;
  allCompanies: { data: ISelectItemPropsWithValueGeneric[] } | undefined;
  allDepartments: { data: ISelectItemPropsWithValueGeneric[] } | undefined;
  isLoading: boolean;
}

const useTableData = (filter: IGetEmployeeLeavesRequest): ITableData => {
  const {
    data: employeeLeavesData,
    isLoading,
    isFetching,
  } = useGetEmployeeLeaveApplicationsQuery(filter);
  const { data: leaveTypes } = useGetAllUnpaginatedLeaveTypesQuery();
  const { data: companies } = useGetAllUnpaginatedCompaniesQuery();
  const { data: departments } = useGetAllUnpaginatedDepartmentsQuery({});

  const allLeaveTypes = formatSelectItems<ILeaveProps>(
    leaveTypes?.data || [],
    "name",
    "leaveId",
  );
  const allCompanies = formatSelectItems<ISelectResponse>(
    companies?.data || [],
    "name",
    "id",
  );
  const allDepartments = formatSelectItems<ISelectResponse>(
    departments?.data || [],
    "name",
    "id",
  );

  return {
    employeeLeavesData,
    leaveTypes: {
      data: allLeaveTypes,
    },
    allDepartments: { data: allDepartments },
    allCompanies: { data: allCompanies },
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
const LeaveRequests = () => {
  const [internalSearchInput, setInternalSearchInput] = useState("");
  const [internalStatusId, setInternalStatusId] = useState("");
  const [internalYearId, setInternalYearId] = useState("");
  const [internalLeaveTypeId, setInternalLeaveTypeId] = useState("");
  const [internalCompanyId, setInternalCompanyId] = useState("");
  const [internalDepartmentId, setInternalDepartmentId] = useState("");
  const [internalPageNumber, setInternalPageNumber] = useState(1);
  const [rowActionData, setRowActionData] = useState<{
    row: IGetEmployeeLeaveItem;
    action: "view" | "delete";
  } | null>(null);

  const {
    data: getLeaveDetails,
    isLoading: isLoadingDetails,
    isFetching,
  } = useGetLeaveApplicationDetailsQuery(
    {
      leaveId: rowActionData?.row?.leaveId ?? "",
    },
    {
      skip: !rowActionData?.row?.leaveId,
    },
  );

  const debouncedSearchTerm = useDebounce(internalSearchInput, SEARCH_DELAY.sm);

  const filter: IGetEmployeeLeavesRequest = useMemo(
    () => ({
      pageNumber: internalPageNumber,
      pageSize: PAGE_SIZE.md,
      searchTerm: debouncedSearchTerm,
      statusId: internalStatusId,
      yearId: internalYearId,
      leaveTypeId: internalLeaveTypeId,
      departmentId: internalDepartmentId,
      companyId: internalCompanyId,
    }),
    [
      internalPageNumber,
      debouncedSearchTerm,
      internalStatusId,
      internalYearId,
      internalLeaveTypeId,
      internalCompanyId,
      internalDepartmentId,
    ],
  );

  const handleSetRowAction = (rowAction: {
    row: IGetEmployeeLeaveItem;
    action: "view" | "delete";
  }) => {
    return setRowActionData(rowAction);
  };
  const {
    employeeLeavesData,
    leaveTypes,
    allCompanies,
    allDepartments,
    statuses,
    isLoading,
  } = useTableData(filter);
  const handleSearch = (value: string) => setInternalSearchInput(value);
  const setPageNumber = (page: number) => setInternalPageNumber(page);
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
        case "company":
          setInternalCompanyId((selectedOption?.value as string) || "");
          break;
        case "department":
          setInternalDepartmentId((selectedOption?.value as string) || "");
          break;
      }
      setInternalPageNumber(1);
    };
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
        <div className="grid grid-cols-4 gap-2 [&>*]:w-full">
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
                { label: "All Leave types", value: "" },
                ...(leaveTypes?.data ? leaveTypes.data : []),
              ].find((leaveType) => leaveType.value === internalLeaveTypeId) ||
              null
            }
            bgColor
          />
          <SMSelectDropDown
            options={[
              { label: "All Companies", value: "" },
              ...(allCompanies?.data ? allCompanies.data : []),
            ]}
            varient="simple"
            onChange={handleSelectChange("company")}
            placeholder="Select company"
            searchable={true}
            value={
              [
                { label: "All Companies", value: "" },
                ...(allCompanies?.data ? allCompanies.data : []),
              ].find((company) => company.value === internalCompanyId) || null
            }
            bgColor
          />
          <SMSelectDropDown
            options={[
              { label: "All Departments", value: "" },
              ...(allDepartments?.data ? allDepartments.data : []),
            ]}
            varient="simple"
            onChange={handleSelectChange("department")}
            placeholder="Select department"
            searchable={true}
            value={
              [
                { label: "All Departments", value: "" },
                ...(allDepartments?.data ? allDepartments.data : []),
              ].find((dept) => dept.value === internalDepartmentId) || null
            }
            bgColor
          />
        </div>
      </div>
    </div>
  );
  const ActionCell: React.FC<ActionCellProps> = ({
    row,
    handleSetRowAction,
  }) => {
    const buttonGroup: ButtonDropdownItem[] = [
      {
        name: "View details",
        onClick: () =>
          handleSetRowAction({ row: row?.original, action: "view" }),
      },
    ];
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="relative isolate flex gap-4"
      >
        <ButtonDropdown buttonGroup={buttonGroup} />
      </div>
    );
  };
  const columns: ExtendedColumn<IGetEmployeeLeaveItem>[] = useMemo(
    () => [
      {
        Header: "Staff ID",
        accessor: "staffId",
        sticky: "left",
      },
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
        Header: "Company",
        accessor: "company",
      },
      {
        Header: "Department",
        accessor: "department",
      },
      {
        Header: "Type of Leave",
        accessor: "name",
      },
      {
        Header: "Leave Duration",
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
        Cell: ({ cell: { row } }) => {
          const label = row.original?.numberOfDays === 1 ? "day" : "days";
          return (
            <div className="flex items-center">{`${row.original.numberOfDays} ${label}`}</div>
          );
        },
      },
      {
        Header: "Supervisor’s Approval",
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

      {
        Header: "Paid",
        accessor: "approval",
        Cell: ({ cell: { row } }) => {
          return <div>{row.original?.payLeaveAllowance ? "Yes" : "No"}</div>;
        },
      },

      {
        Header: "Action",
        id: "action",
        Cell: ({ cell: { row } }) => (
          <ActionCell handleSetRowAction={handleSetRowAction} row={row} />
        ),
      },
    ],
    [],
  );

  const leaveDetailsData = [
    {
      title: "Staff ID",
      value: getLeaveDetails?.data?.staffId ?? "-",
    },
    {
      title: "Full Name ",
      value: getLeaveDetails?.data?.employeeName ?? "-",
    },
    {
      title: "Company",
      value: getLeaveDetails?.data?.company ?? "-",
    },
    {
      title: "Department",
      value: getLeaveDetails?.data?.department ?? "-",
    },
    {
      title: "Total leave being taken",
      value: `${String(getLeaveDetails?.data?.numberOfDays)} ${getLeaveDetails && getLeaveDetails?.data?.numberOfDays < 1 ? "day" : "days"}`,
    },
    {
      title: "Relief staff",
      value: getLeaveDetails?.data?.reliefStaff ?? "-",
    },
    {
      title: "Leave duration",
      value: (
        <Typography variant="h-s" color={"text-light"}>
          {getLeaveDetails?.data?.from &&
            formatDate(getLeaveDetails?.data.from)}{" "}
          - {getLeaveDetails?.data?.to && formatDate(getLeaveDetails?.data.to)}
        </Typography>
      ),
    },
    {
      title: "Contact address during leave",
      value: getLeaveDetails?.data?.leaveContactAddress,
    },
    {
      title: "Phone number during leave",
      value: getLeaveDetails?.data?.leavePhoneNumber,
    },
    {
      title: "Alternative contact person while on leave",
      value: getLeaveDetails?.data?.alternateContactPerson,
    },
    {
      title: "Address",
      value: getLeaveDetails?.data?.alternateContactPersonAddress,
    },
    {
      title: "Phone number",
      value: getLeaveDetails?.data?.leavePhoneNumber,
    },
    {
      title: "Email address of contact person",
      value:
        getLeaveDetails?.data?.alternateContactPersonEmail !== null
          ? getLeaveDetails?.data?.alternateContactPersonEmail
          : "-",
    },
    {
      title: "Type of leave",
      value: getLeaveDetails?.data?.leaveType ?? "-",
    },
    {
      title: "Pay leave allowance",
      value: getLeaveDetails?.data?.payLeaveAllowance ? "Yes" : "No",
    },
    {
      title: "Supervisor",
      value: (
        <div className="flex items-center gap-2">
          <Typography variant="h-s" color={"text-light"}>
            {getLeaveDetails?.data?.supervisor ?? "-"}
          </Typography>
          <Badge
            variant={getLeaveApprovalStatusBadgeVariant(
              getLeaveDetails?.data?.approval ?? "Pending",
            )}
            text={getLeaveDetails?.data?.approval ?? "Pending"}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Modal
        isOpen={rowActionData?.action === "view"}
        closeModal={() => setRowActionData(null)}
        title="Leave Request"
        mobileLayoutType="full"
      >
        <ViewEmployeeLeaveDetails
          data={leaveDetailsData}
          loading={isFetching || isLoadingDetails}
        />
      </Modal>
      <PageHeader title="Leave Requests" />
      <div className="mt-6 w-full">
        {renderFilters()}
        {employeeLeavesData?.data?.items &&
        employeeLeavesData?.data?.items?.length < 1 ? (
          <div className="flex min-h-[500px] items-center justify-center pt-2">
            <EmptyPageState
              title="No Leave Applications Yet"
              text="Leave applications will show up here when requested by any employee."
            />
          </div>
        ) : (
          <TMTable<IGetEmployeeLeaveItem>
            columns={columns}
            data={employeeLeavesData?.data.items || []}
            title="Leave Applications"
            isServerSidePagination={true}
            availablePages={employeeLeavesData?.data?.metaData?.totalPages || 1}
            setPageNumber={setPageNumber}
            loading={isLoading}
            metaData={employeeLeavesData?.data?.metaData as MetaData}
          />
        )}
      </div>
    </div>
  );
};

export default LeaveRequests;

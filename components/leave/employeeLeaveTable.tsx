"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Badge,
  Button,
  ButtonDropdown,
  ButtonDropdownItem,
  ConfirmationModal,
  ExtendedColumn,
  Modal,
  notify,
  OptionType,
  Search,
  SMSelectDropDown,
  TMTable,
  Typography,
  ViewEmployeeLeaveDetails,
} from "@/components";
import { PAGE_SIZE, SEARCH_DELAY } from "@/constants/data";
import { AuthRouteConfig } from "@/constants/routes";
import {
  IGetEmployeeLeaveItem,
  IGetEmployeeLeavesRequest,
  ILeaveProps,
  MetaData,
  useDeleteEmployeeLeaveApplicationsMutation,
  useGetAllUnpaginatedLeaveTypesQuery,
  useGetEmployeeLeaveApplicationsQuery,
  useGetLeaveApplicationDetailsQuery,
} from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";
import { ISelectItemPropsWithValueGeneric } from "@/redux/api/interface";
import { resetLeaveApplication } from "@/redux/api/leave/leaveApplicationForm.slice";
import { ISelectResponse, useGetAllYearsQuery } from "@/redux/api/select";
import { getErrorMessage } from "@/utils/getErrorMessges";
import {
  formatDate,
  formatSelectItems,
  getLeaveApprovalStatusBadgeVariant,
} from "@/utils/helpers";
import { useDebounce } from "@/utils/useDebouncedInput";
import { useDispatch } from "react-redux";

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

interface IEmployeeProps {
  employeeId: string;
  year?: string;
}
const useTableData = (filter: IGetEmployeeLeavesRequest): ITableData => {
  const {
    data: employeeLeavesData,
    isLoading,
    isFetching,
  } = useGetEmployeeLeaveApplicationsQuery(filter);
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
          id: "null",
        },
      ],
    },
    isLoading: isLoading || isFetching,
  };
};

interface ActionCellProps {
  row: { original: IGetEmployeeLeaveItem };
  handleSetRowAction: (rowAction: {
    row: IGetEmployeeLeaveItem;
    action: "view" | "delete";
  }) => void;
}

const ActionCell: React.FC<ActionCellProps> = ({ row, handleSetRowAction }) => {
  const buttonGroup: ButtonDropdownItem[] = [
    {
      name: "View details",
      onClick: () => handleSetRowAction({ row: row?.original, action: "view" }),
    },
    {
      name: "Delete",
      textColor: "R400",
      onClick: () =>
        handleSetRowAction({ row: row?.original, action: "delete" }),
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

export const EmployeeLeaveTable = ({ employeeId, year }: IEmployeeProps) => {
  const dispatch = useDispatch();
  const [internalSearchInput, setInternalSearchInput] = useState("");
  const [internalStatusId, setInternalStatusId] = useState("");
  const [internalYearId, setInternalYearId] = useState("");
  const [internalLeaveTypeId, setInternalLeaveTypeId] = useState("");
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
  const [deleteLeaveApplication, { isLoading: isDeleting }] =
    useDeleteEmployeeLeaveApplicationsMutation();

  const handleSetRowAction = (rowAction: {
    row: IGetEmployeeLeaveItem;
    action: "view" | "delete";
  }) => {
    return setRowActionData(rowAction);
  };

  const debouncedSearchTerm = useDebounce(internalSearchInput, SEARCH_DELAY.sm);

  const filter: IGetEmployeeLeavesRequest = useMemo(
    () => ({
      pageNumber: internalPageNumber,
      pageSize: PAGE_SIZE.md,
      searchTerm: debouncedSearchTerm,
      statusId: internalStatusId,
      yearId: year ?? internalYearId,
      leaveTypeId: internalLeaveTypeId,
      employeeId,
    }),
    [
      internalPageNumber,
      debouncedSearchTerm,
      internalStatusId,
      internalYearId,
      internalLeaveTypeId,
      employeeId,
      year,
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
        Header: "Supervisor’s Approval",
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
        Cell: ({ cell: { row } }) => (
          <ActionCell handleSetRowAction={handleSetRowAction} row={row} />
        ),
      },
    ],
    [],
  );

  const renderFilters = () => (
    <div className="mb-4">
      {!employeeId && (
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
                    ? formatSelectItems<ISelectResponse>(
                        years.data,
                        "name",
                        "id",
                      )
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
                  { label: "All Status", value: "" },
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
                ].find((dept) => dept.value === internalLeaveTypeId) || null
              }
              bgColor
            />
          </div>
        </div>
      )}
    </div>
  );

  const deleteAction = () => {
    if (!rowActionData?.row) {
      return notify.success({
        message: "Leave ID is required",
        subtitle: "Please trigger deletion again",
      });
    }

    deleteLeaveApplication(`${rowActionData?.row?.leaveId}`)
      .unwrap()
      .then(() => {
        notify.success({
          message: "Leave application deleted successfully",
          subtitle: `You have successfully deleted  ${rowActionData?.row?.name}`,
        });
        setRowActionData(null);
      })
      .catch((error) => {
        notify.error({
          message: "Failed to delete leave application",
          subtitle: getErrorMessage(error as IApiError),
        });
      });
  };

  const leaveDetailsData = [
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
    <div>
      <div>
        <Modal
          isOpen={rowActionData?.action === "view"}
          closeModal={() => setRowActionData(null)}
          title="Leave Application Form"
          mobileLayoutType="full"
        >
          <ViewEmployeeLeaveDetails
            data={leaveDetailsData}
            loading={isFetching || isLoadingDetails}
          />
        </Modal>
        {renderFilters()}
        <TMTable<IGetEmployeeLeaveItem>
          columns={columns}
          data={employeeLeavesData?.data.items || []}
          title="Leave Applications"
          additionalTitleData={
            !employeeId && (
              <Link href={AuthRouteConfig.STAFF_LEAVE_APPLY}>
                <Button onClick={() => dispatch(resetLeaveApplication())}>
                  Apply for Leave
                </Button>
              </Link>
            )
          }
          availablePages={employeeLeavesData?.data?.metaData?.totalPages || 1}
          setPageNumber={setPageNumber}
          loading={isLoading}
          isServerSidePagination={true}
          metaData={employeeLeavesData?.data?.metaData as MetaData}
        />
        <ConfirmationModal
          isOpen={rowActionData?.action === "delete"}
          closeModal={() => setRowActionData(null)}
          handleClick={deleteAction}
          formTitle="Delete Leave Application"
          message={
            <p>
              You are about to delete this leave from list. Do you wish to
              continue?
            </p>
          }
          isLoading={isDeleting}
          type="delete"
          buttonLabel="Delete"
        />
      </div>
    </div>
  );
};

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Avatar,
  Badge,
  ButtonDropdown,
  ButtonDropdownItem,
  ConfirmationModal,
  ExtendedColumn,
  notify,
  OptionType,
  Search,
  SMSelectDropDown,
  Spinner,
  TMTable,
} from "@/components";
import { PAGE_SIZE, SEARCH_DELAY } from "@/constants/data";
import { AuthRouteConfig } from "@/constants/routes";
import {
  IGetEmployeeEnrollmentListRequest,
  MetaData,
  useDeleteEmployeeMutation,
  useGetAllUnpaginatedCompaniesQuery,
  useGetAllUnpaginatedDepartmentsQuery,
  useGetEmployeeEnrollmentListQuery,
  useLazyGetEmployeeEnrollmentQuery,
  useTriggerEmployeeEmploymentMutation,
  useWithdrawEmployeeMutation,
} from "@/redux/api";
import { setEnrollmentData } from "@/redux/api/employee/enrollmentForm.slice";
import { IApiError } from "@/redux/api/genericInterface";
import { EnrollmentStatusType } from "@/redux/api/interface";
import { ISelectResponse, useGetStatusesQuery } from "@/redux/api/select";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { formatSelectItems, getEnrollmentBadgeVariant } from "@/utils/helpers";
import { useDebounce } from "@/utils/useDebouncedInput";
import { useDispatch } from "react-redux";

import useMediaQuery from "@/hooks/useMediaQuery";

export interface IEmployeeProps {
  userId: string;
  employeeId: string;
  fullname: string;
  firstname: string;
  lastname: string;
  email: string;
  company: string | null;
  location: string | null;
  department: string | null;
  documents: number;
  status: EnrollmentStatusType;
  dateCreated: string;
  reviewer: string;
}

interface ITableData {
  employeeListData:
    | {
        data: {
          items: IEmployeeProps[];
          metaData: {
            totalPages: number;
          };
        };
      }
    | undefined;
  companies: { data: ISelectResponse[] } | undefined;
  departments: { data: ISelectResponse[] } | undefined;
  statuses: { data: ISelectResponse[] } | undefined;
  isLoading: boolean;
  isLoadingStatuses: boolean;
}

const useTableData = (
  filter: IGetEmployeeEnrollmentListRequest,
): ITableData => {
  const {
    data: employeeListData,
    isLoading,
    isFetching,
  } = useGetEmployeeEnrollmentListQuery(filter);
  const { data: companies } = useGetAllUnpaginatedCompaniesQuery();
  const { data: departments } = useGetAllUnpaginatedDepartmentsQuery({});
  const { data: statuses, isLoading: isLoadingStatuses } =
    useGetStatusesQuery();
  return {
    employeeListData,
    companies,
    departments,
    statuses,
    isLoading: isLoading || isFetching,
    isLoadingStatuses,
  };
};

interface FullNameCellProps {
  fullname: string;
  email: string;
}

const FullNameCell: React.FC<FullNameCellProps> = ({ fullname, email }) => (
  <div className="flex w-[300px] items-center gap-2 bg-white">
    <Avatar fullname={fullname} size="sm" />
    <div className="flex flex-col">
      <span>{fullname}</span>
      <span className="text-xs text-gray-400">{email}</span>
    </div>
  </div>
);

interface ActionCellProps {
  row: { original: IEmployeeProps };
  router: ReturnType<typeof useRouter>;
  setEditData: React.Dispatch<React.SetStateAction<IEmployeeProps | null>>;
  setOpenWithDrawEnrollment: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenDelete: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenReminder: React.Dispatch<React.SetStateAction<boolean>>;
  dispatch: ReturnType<typeof useDispatch>;
  updateUrlParams: () => void;
}

const ActionCell: React.FC<ActionCellProps> = ({
  row,
  router,
  setEditData,
  setOpenWithDrawEnrollment,
  setOpenDelete,
  setOpenReminder,
  dispatch,
  updateUrlParams,
}) => {
  const [getUserEnrollmentData, { isLoading, isFetching }] =
    useLazyGetEmployeeEnrollmentQuery();

  const handleContinue = () => {
    getUserEnrollmentData(row.original.employeeId)
      .unwrap()
      .then((response) => {
        if (response?.data) {
          dispatch(setEnrollmentData(response.data));
          router.push(AuthRouteConfig.EMPLOYEE_MANAGEMENT_ENROLLMENT_CREATE);
        } else {
          throw new Error("No enrollment data found");
        }
      })
      .catch((error) => {
        notify.error({
          message: "Failed to fetch Users info",
          subtitle: getErrorMessage(error as IApiError),
        });
      });
  };

  const buttonGroup: ButtonDropdownItem[] = [
    ...(row.original.status !== "Continue"
      ? [
          {
            name: "View",
            onClick: () => {
              updateUrlParams();
              router.push(
                `${AuthRouteConfig.EMPLOYEE_MANAGEMENT_ENROLLMENT_VIEW}/${row.original.employeeId}`,
              );
            },
          },
        ]
      : [
          {
            name: "Continue",
            onClick: handleContinue,
          },
        ]),
    ...(["In Progress", "Pending"].some(
      (status) => status === row.original.status,
    )
      ? [
          {
            name: "Withdraw",

            onClick: () => {
              setEditData(row.original);
              setOpenWithDrawEnrollment(true);
            },
          },
        ]
      : []),
    ...(row.original.status !== "Completed" &&
    row.original.status !== "Withdrawn"
      ? [
          {
            name: "Set Remainder",
            onClick: () => {
              setEditData(row.original);
              setOpenReminder(true);
            },
          },
        ]
      : []),
    {
      name: "Delete",
      textColor: "R400",
      onClick: () => {
        setEditData(row.original);
        setOpenDelete(true);
      },
    },
  ];

  return (
    <div className="relative isolate flex gap-4">
      {isLoading || isFetching ? (
        <div className="relative h-6 w-6 [&>div>div]:aspect-square [&>div>div]:h-full [&>div]:aspect-square [&>div]:h-full">
          <Spinner />
        </div>
      ) : (
        <ButtonDropdown buttonGroup={buttonGroup} />
      )}
    </div>
  );
};

export const EnrollmentTable: React.FC = () => {
  const isDesktop = useMediaQuery("(min-width: 1025px)");
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const [openWithDrawEnrollment, setOpenWithDrawEnrollment] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openReminder, setOpenReminder] = useState(false);
  const [editData, setEditData] = useState<IEmployeeProps | null>(null);

  const [internalSearchInput, setInternalSearchInput] = useState("");
  const [internalStatusId, setInternalStatusId] = useState("");
  const [internalDepartmentId, setInternalDepartmentId] = useState("");
  const [internalCompanyId, setInternalCompanyId] = useState("");
  const [internalPageNumber, setInternalPageNumber] = useState(1);

  useEffect(() => {
    setInternalSearchInput(searchParams.get("search") || "");
    setInternalStatusId(searchParams.get("status") || "");
    setInternalDepartmentId(searchParams.get("department") || "");
    setInternalCompanyId(searchParams.get("company") || "");
    setInternalPageNumber(Number(searchParams.get("page")) || 1);
  }, [searchParams]);

  const debouncedSearchTerm = useDebounce(internalSearchInput, SEARCH_DELAY.sm);

  const filter: IGetEmployeeEnrollmentListRequest = useMemo(
    () => ({
      pageNumber: internalPageNumber,
      pageSize: PAGE_SIZE.md,
      searchTerm: debouncedSearchTerm,
      statusId: internalStatusId,
      departmentId: internalDepartmentId,
      companyId: internalCompanyId,
      newUsers: "true",
    }),
    [
      internalPageNumber,
      debouncedSearchTerm,
      internalStatusId,
      internalDepartmentId,
      internalCompanyId,
    ],
  );

  const {
    employeeListData,
    companies,
    departments,
    statuses,
    isLoading,
    isLoadingStatuses,
  } = useTableData(filter);
  const [deleteEmployee, { isLoading: isLoadingDelete }] =
    useDeleteEmployeeMutation();
  const [triggerEmployeeEnrollment, { isLoading: isSendingRemainder }] =
    useTriggerEmployeeEmploymentMutation();
  const [withdrawEmployee, { isLoading: isLoadingWithdrawing }] =
    useWithdrawEmployeeMutation();

  const updateUrlParams = useCallback(() => {
    const newSearchParams = new URLSearchParams();
    if (internalSearchInput) newSearchParams.set("search", internalSearchInput);
    if (internalStatusId) newSearchParams.set("status", internalStatusId);
    if (internalDepartmentId)
      newSearchParams.set("department", internalDepartmentId);
    if (internalCompanyId) newSearchParams.set("company", internalCompanyId);
    if (internalPageNumber !== 1)
      newSearchParams.set("page", internalPageNumber.toString());
    router.push(`?${newSearchParams.toString()}`);
  }, [
    router,
    internalSearchInput,
    internalStatusId,
    internalDepartmentId,
    internalCompanyId,
    internalPageNumber,
  ]);

  const handleSearch = (value: string) => setInternalSearchInput(value);

  const handleSelectChange =
    (key: string) => (selectedOption: OptionType | null) => {
      switch (key) {
        case "status":
          setInternalStatusId((selectedOption?.value as string) || "");
          break;
        case "department":
          setInternalDepartmentId((selectedOption?.value as string) || "");
          break;
        case "company":
          setInternalCompanyId((selectedOption?.value as string) || "");
          break;
      }
      setInternalPageNumber(1);
    };

  const setPageNumber = (page: number) => setInternalPageNumber(page);

  const columns: ExtendedColumn<IEmployeeProps>[] = useMemo(
    () => [
      {
        Header: "Full Name",
        accessor: "fullname",
        sticky: isDesktop ? "left" : undefined,
        Cell: ({ cell: { row } }) => <FullNameCell {...row.original} />,
      },
      {
        Header: "Company",
        accessor: "company",
        Cell: ({ cell: { value } }) => <span>{value ?? "_ _"}</span>,
      },
      {
        Header: "Location",
        accessor: "location",
        Cell: ({ cell: { value } }) => <span>{value ?? "_ _"}</span>,
      },
      {
        Header: "Department",
        accessor: "department",
        Cell: ({ cell: { value } }) => (
          <span className="text-start">{value ?? "_ _"}</span>
        ),
      },
      {
        Header: "Documents",
        accessor: "documents",
        Cell: ({ cell: { value } }) => <span>{value ?? "_ _"}</span>,
      },
      {
        Header: "Reviewer",
        accessor: "reviewer",
        Cell: ({ cell: { value } }) => <span>{value ?? "_ _"}</span>,
      },
      {
        Header: "Enrollment",
        accessor: "status",
        Cell: ({ cell: { value } }) => (
          <Badge
            variant={getEnrollmentBadgeVariant(value ?? "Continue")}
            text={value ?? "Continue"}
          />
        ),
      },
      {
        Header: "Date Created",
        accessor: "dateCreated",
        Cell: ({ cell: { value } }) => (
          <span>{new Date(value).toLocaleDateString()}</span>
        ),
      },
      {
        Header: "Action",
        id: "action",
        Cell: ({ cell: { row } }) => (
          <ActionCell
            row={row}
            router={router}
            setEditData={setEditData}
            setOpenWithDrawEnrollment={setOpenWithDrawEnrollment}
            setOpenDelete={setOpenDelete}
            setOpenReminder={setOpenReminder}
            dispatch={dispatch}
            updateUrlParams={updateUrlParams}
          />
        ),
      },
    ],
    [router, updateUrlParams, dispatch],
  );

  const deleteAction = () => {
    if (editData?.employeeId) {
      deleteEmployee(editData.employeeId)
        .unwrap()
        .then(() => {
          notify.success({
            message: `Deleted Successfully`,
            subtitle: `You have successfully deleted ${editData.fullname}`,
          });
          setOpenDelete(false);
        })
        .catch((err: IApiError) => {
          notify.error({
            message: "Deletion failed",
            subtitle: getErrorMessage(err),
          });
        });
    }
  };
  const withdrawalAction = () => {
    if (editData?.employeeId) {
      withdrawEmployee(editData.employeeId)
        .unwrap()
        .then(() => {
          notify.success({
            message: `Withdrawn Successfully`,
            subtitle: `You have successfully withdrawn ${editData.fullname}`,
          });
          setOpenDelete(false);
        })
        .catch((err: IApiError) => {
          notify.error({
            message: "Withdrawal failed",
            subtitle: getErrorMessage(err),
          });
        });
    }
  };
  const reminderAction = () => {
    if (editData?.employeeId) {
      triggerEmployeeEnrollment({
        employeeId: editData.employeeId,
        remainder: true,
      })
        .unwrap()
        .then(() => {
          notify.success({
            message: `Reminder Sent Successfully`,
            subtitle: `You have successfully reminded ${editData.fullname} about their enrollment`,
          });
          setOpenReminder(false);
        })
        .catch((err: IApiError) => {
          notify.error({
            message: "Remainder failed",
            subtitle: getErrorMessage(err),
          });
        });
    }
  };

  const renderModals = () => (
    <>
      <ConfirmationModal
        isOpen={openWithDrawEnrollment}
        closeModal={() => setOpenWithDrawEnrollment(false)}
        handleClick={withdrawalAction}
        formTitle="Withdraw Enrollment"
        message={
          <p>
            Are you sure you want to withdraw{" "}
            <span className="text-R400">{editData?.fullname}</span>&apos;s
            enrollment? This action cannot be undone do you wish to proceed?
          </p>
        }
        isLoading={isLoadingWithdrawing}
        type="delete"
        buttonLabel="Yes, Withdraw"
      />
      <ConfirmationModal
        isOpen={openDelete}
        closeModal={() => setOpenDelete(false)}
        handleClick={deleteAction}
        formTitle="Delete Enrollment"
        message={
          <p>
            Are you sure you want to delete{" "}
            <span className="text-R400">{editData?.firstname}</span>&apos;s
            enrollment? You will lose all inputted data. This action cannot be
            undone do you wish to proceed?
          </p>
        }
        isLoading={isLoadingDelete}
        type="delete"
        buttonLabel="Yes, Delete"
      />
      <ConfirmationModal
        isOpen={openReminder}
        closeModal={() => setOpenReminder(false)}
        handleClick={reminderAction}
        formTitle="Send Enrollment Reminder "
        message={
          <p>
            Are you sure you want to remind{" "}
            <span className="text-R400">{editData?.firstname}</span> about their
            enrollment? This will send an email notification to the user. Do you
            wish to proceed?
          </p>
        }
        isLoading={isSendingRemainder}
        type="confirm"
        buttonLabel="Yes, Proceed"
      />
    </>
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
              { label: "All Status", value: "" },
              ...(statuses?.data
                ? formatSelectItems<ISelectResponse>(
                    statuses.data,
                    "name",
                    "id",
                  )
                : []),
            ]}
            varient="simple"
            loading={isLoadingStatuses}
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
              { label: "All Departments", value: "" },
              ...(departments?.data
                ? formatSelectItems<ISelectResponse>(
                    departments.data,
                    "name",
                    "id",
                  )
                : []),
            ]}
            varient="simple"
            onChange={handleSelectChange("department")}
            placeholder="Select Department"
            searchable={true}
            value={
              [
                { label: "All Departments", value: "" },
                ...(departments?.data
                  ? formatSelectItems<ISelectResponse>(
                      departments.data,
                      "name",
                      "id",
                    )
                  : []),
              ].find((dept) => dept.value === internalDepartmentId) || null
            }
            bgColor
          />
          <SMSelectDropDown
            options={[
              { label: "All Companies", value: "" },
              ...(companies?.data
                ? formatSelectItems<ISelectResponse>(
                    companies.data,
                    "name",
                    "id",
                  )
                : []),
            ]}
            varient="simple"
            onChange={handleSelectChange("company")}
            placeholder="Select Company"
            searchable={true}
            value={
              [
                { label: "All Companies", value: "" },
                ...(companies?.data
                  ? formatSelectItems<ISelectResponse>(
                      companies.data,
                      "name",
                      "id",
                    )
                  : []),
              ].find((company) => company.value === internalCompanyId) || null
            }
            bgColor
          />
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {renderModals()}
      <div>
        {renderFilters()}
        <TMTable<IEmployeeProps>
          columns={columns}
          data={employeeListData?.data.items || []}
          title="Employees"
          availablePages={employeeListData?.data?.metaData?.totalPages || 1}
          setPageNumber={setPageNumber}
          loading={isLoading}
          isServerSidePagination={true}
          metaData={employeeListData?.data?.metaData as MetaData}
        />
      </div>
    </div>
  );
};

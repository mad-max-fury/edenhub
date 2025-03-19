"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, Badge, ButtonDropdown, ButtonDropdownItem, ExtendedColumn, OptionType, Search, SMSelectDropDown, TMTable } from "@/components";
import { PAGE_SIZE, SEARCH_DELAY } from "@/constants/data";
import { AuthRouteConfig } from "@/constants/routes";
import { IGetEmployeeDirectoryRequest, MetaData, useGetAllUnpaginatedCompaniesQuery, useGetAllUnpaginatedDepartmentsQuery, useGetEmployeeDirectoryQuery } from "@/redux/api";
import { EnrollmentStatusType } from "@/redux/api/interface";
import { ISelectResponse } from "@/redux/api/select";
import { formatSelectItems } from "@/utils/helpers";
import { useDebounce } from "@/utils/useDebouncedInput";



import useMediaQuery from "@/hooks/useMediaQuery";





export interface IGetEmployeeDirectoryItem {
  userName: string;
  employeeId: string;
  staffId: string;
  lastname: string;
  firstname: string;
  middlename: string;
  phoneNumber: string;
  company: string;
  companyId: string;
  location: string;
  locationId: string;
  department: string;
  departmentId: string;
  businessUnit: string;
  businessUnitId: string;
  enrollmentStatus: EnrollmentStatusType;
  employmentStatus: string;
  enrollmentStatusId: string;
  dateOfResumption: string;
  profilePicture: string;
  status: string;
}

interface ITableData {
  employeeListData:
    | {
        data: {
          items: IGetEmployeeDirectoryItem[];
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
}

const useTableData = (filter: IGetEmployeeDirectoryRequest): ITableData => {
  const {
    data: employeeListData,
    isLoading,
    isFetching,
  } = useGetEmployeeDirectoryQuery(filter);
  const { data: companies } = useGetAllUnpaginatedCompaniesQuery();
  const { data: departments } = useGetAllUnpaginatedDepartmentsQuery({});

  return {
    employeeListData,
    companies,
    departments,
    statuses: {
      data: [
        {
          id: "true",
          name: "Active",
        },
        {
          id: "false",
          name: "Inactive",
        },
      ],
    },
    isLoading: isLoading || isFetching,
  };
};

interface FullNameCellProps {
  firstname: string;
  middlename: string;
  lastname: string;
  employeeId: string;
  userName: string;
  profilePicture: string;
}

const FullNameCell: React.FC<FullNameCellProps> = ({
  firstname,
  lastname,
  middlename,
  userName,
}) => {
  const fullname = [firstname, middlename, lastname].filter(Boolean).join(" ");
  return (
    <div className="flex w-[300px] items-center gap-2 ">
      <Avatar fullname={fullname} size="sm" />
      <div className="flex flex-col">
        <span>{fullname}</span>
        <span className="text-wrap text-xs text-gray-400">{userName}</span>
      </div>
    </div>
  );
};

interface ActionCellProps {
  row: { original: IGetEmployeeDirectoryItem };
  router: ReturnType<typeof useRouter>;
  updateUrlParams: () => void;
}

const ActionCell: React.FC<ActionCellProps> = ({
  row,
  router,
  updateUrlParams,
}) => {
  const buttonGroup: ButtonDropdownItem[] = [
    ...[
      {
        name: "View",
        onClick: () => {
          updateUrlParams();
          router.push(
            `${AuthRouteConfig.EMPLOYEE_MANAGEMEN_ALL_EMPLOYEE}/${row.original.employeeId}/profile`,
          );
        },
      },
    ],
  ];

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
      className="relative isolate flex w-fit gap-4"
    >
      <ButtonDropdown buttonGroup={buttonGroup} />
    </div>
  );
};

export const AllEmployeeTable: React.FC = () => {
  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width: 1025px)");

  // const searchParams = useSearchParams();

  const [internalSearchInput, setInternalSearchInput] = useState("");
  const [internalStatusId, setInternalStatusId] = useState("");
  const [internalDepartmentId, setInternalDepartmentId] = useState("");
  const [internalCompanyId, setInternalCompanyId] = useState("");
  const [internalPageNumber, setInternalPageNumber] = useState(1);

  // useEffect(() => {
  //   setInternalSearchInput(searchParams.get("search") || "");
  //   setInternalStatusId(searchParams.get("status") || "");
  //   setInternalDepartmentId(searchParams.get("department") || "");
  //   setInternalCompanyId(searchParams.get("company") || "");
  //   setInternalPageNumber(Number(searchParams.get("page")) || 1);
  // }, [searchParams]);

  const debouncedSearchTerm = useDebounce(internalSearchInput, SEARCH_DELAY.sm);

  const filter: IGetEmployeeDirectoryRequest = useMemo(
    () => ({
      pageNumber: internalPageNumber,
      pageSize: PAGE_SIZE.md,
      searchTerm: debouncedSearchTerm,
      statusId: internalStatusId,
      departmentId: internalDepartmentId,
      companyId: internalCompanyId,
    }),
    [
      internalPageNumber,
      debouncedSearchTerm,
      internalStatusId,
      internalDepartmentId,
      internalCompanyId,
    ],
  );

  const { employeeListData, companies, departments, statuses, isLoading } =
    useTableData(filter);

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

  const columns: ExtendedColumn<IGetEmployeeDirectoryItem>[] = useMemo(
    () => [
      {
        Header: "Full Name",
        accessor: "userName",
        sticky: isDesktop ? "left" : undefined,
        Cell: ({ cell: { row } }) => <FullNameCell {...row.original} />,
      },
      {
        Header: "Staff ID",
        accessor: "staffId",
        Cell: ({ cell: { value } }) => (
          <span className="uppercase">{value ?? "_ _"}</span>
        ),
      },
      {
        Header: "Phone Number",
        accessor: "phoneNumber",
        Cell: ({ cell: { value } }) => <span>{value ?? "_ _"}</span>,
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
        Cell: ({ cell: { value } }) => <span>{value ?? "_ _"}</span>,
      },
      {
        Header: "Unit",
        accessor: "businessUnit",
        Cell: ({ cell: { value } }) => <span>{value ?? "_ _"}</span>,
      },
      {
        Header: "Employmnet Type",
        accessor: "employmentStatus",
        Cell: ({ cell: { value } }) => <span>{value ?? "_ _"}</span>,
      },
      {
        Header: "Account Status",
        accessor: "status",
        Cell: ({ cell: { value } }) => (
          <Badge
            variant={value ? "green" : "red"}
            text={value ? "Active" : "Inactive"}
          />
        ),
      },
      {
        Header: "Date Of Resumption",
        accessor: "dateOfResumption",
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
            updateUrlParams={updateUrlParams}
          />
        ),
      },
    ],
    [router, updateUrlParams, isDesktop],
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
      <div>
        {renderFilters()}
        <TMTable<IGetEmployeeDirectoryItem>
          columns={columns}
          data={employeeListData?.data.items || []}
          title="All Employees"
          availablePages={employeeListData?.data?.metaData?.totalPages || 1}
          setPageNumber={setPageNumber}
          loading={isLoading}
          isServerSidePagination={true}
          // onRowClick={(row) => {
          //   return router.push(
          //     `${AuthRouteConfig.EMPLOYEE_MANAGEMEN_ALL_EMPLOYEE}/${row.original.employeeId}/profile`,
          //   );
          // }}
          metaData={employeeListData?.data?.metaData as MetaData}
        />
      </div>
    </div>
  );
};
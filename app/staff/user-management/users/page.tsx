"use client";

import React, { useMemo, useState } from "react";
import {
  NetworkError,
  PageHeader,
  PageLoader,
  Search,
  SMSelectDropDown,
} from "@/components";
import { PAGE_SIZE } from "@/constants/data";
import {
  useGetAllUnpaginatedCompaniesQuery,
  useGetAllUnpaginatedDepartmentsQuery,
  useGetAllUnpaginatedRolesQuery,
  useGetAllUsersQuery,
} from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";
import { ISelectResponse } from "@/redux/api/select";
import { formatSelectItems } from "@/utils/helpers";
import { useDebounce } from "@/utils/useDebouncedInput";

import { UsersTable } from "./components";

const Page = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleId, setRoleId] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const pageSize = PAGE_SIZE.sm;
  const debouncedInput = useDebounce(searchTerm);
  const query = useMemo(() => {
    return {
      pageNumber,
      searchTerm: debouncedInput,
      pageSize,
      roleId,
      companyId,
      departmentId,
    };
  }, [pageNumber, pageSize, debouncedInput, roleId, companyId, departmentId]);
  const { data, isFetching, error, refetch } = useGetAllUsersQuery(query);
  const { data: roles, isLoading: isLoadingRoles } =
    useGetAllUnpaginatedRolesQuery();
  const { data: companies, isLoading: isLoadingCompanies } =
    useGetAllUnpaginatedCompaniesQuery();
  const { data: departments, isLoading: isLoadingDepartments } =
    useGetAllUnpaginatedDepartmentsQuery({});
  const allRoles = formatSelectItems<ISelectResponse>(
    roles?.data || [],
    "name",
    "id",
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

  if (isLoadingCompanies || isLoadingDepartments || isLoadingRoles)
    return <PageLoader />;
  if (error)
    return (
      <NetworkError
        error={error as IApiError}
        refetch={refetch}
        isFetching={isFetching}
      />
    );
  return (
    <>
      <div>
        <PageHeader title="All Users" />
        <div className="my-4">
          <div className="flex items-center gap-2">
            <div className="w-full max-w-[260px]">
              <Search
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPageNumber(1);
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-[170px]">
                <SMSelectDropDown
                  bgColor
                  defaultValue={{ label: "All Roles", value: "" }}
                  options={[{ label: "All Roles", value: "" }, ...allRoles]}
                  onChange={(e) => setRoleId(String(e.value))}
                />
              </div>
              <div className="w-[170px]">
                <SMSelectDropDown
                  bgColor
                  defaultValue={{ label: "All Departments", value: "" }}
                  options={[
                    { label: "All Departments", value: "" },
                    ...allDepartments,
                  ]}
                  onChange={(e) => setDepartmentId(String(e.value))}
                />
              </div>
              <div className="w-[170px]">
                <SMSelectDropDown
                  bgColor
                  defaultValue={{ label: "All Companies", value: "" }}
                  options={[
                    { label: "All Companies", value: "" },
                    ...allCompanies,
                  ]}
                  onChange={(e) => setCompanyId(String(e.value))}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12">
          <UsersTable
            tableData={data?.data || undefined}
            loading={isFetching}
            setPageNumber={setPageNumber}
            allRoles={allRoles}
          />
        </div>
      </div>
    </>
  );
};

export default Page;

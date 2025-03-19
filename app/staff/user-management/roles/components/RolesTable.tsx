import React, { useState } from "react";
import Link from "next/link";
import {
  ActionButton,
  ConfirmationModal,
  ExtendedColumn,
  notify,
  Search,
  TMTable,
} from "@/components";
import { AuthRouteConfig } from "@/constants/routes";
import {
  IPaginatedRolesResponse,
  IRolesProps,
  useDeleteRoleMutation,
} from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";
import { ITableProps } from "@/redux/api/interface";
import { getErrorMessage } from "@/utils/getErrorMessges";

export const RolesTable = ({
  tableData,
  setPageNumber,
  setSearchTerm,
  pageSize,
  pageNumber,
  loading,
  searchTerm,
}: ITableProps<IPaginatedRolesResponse>) => {
  const [editData, setEditData] = useState<IRolesProps | null>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteRole, { isLoading }] = useDeleteRoleMutation();

  const columns: ExtendedColumn<IRolesProps>[] = React.useMemo(
    () => [
      {
        Header: "S/N",
        sticky: "left",
        accessor: "id",
        Cell: ({ cell: { row } }) => (
          <div>
            <span>{pageSize * (pageNumber - 1) + (row.index + 1)}</span>
          </div>
        ),
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Permissions",
        accessor: "claimCount",
      },
      {
        Header: "Staff",
        accessor: "employees",
      },

      {
        Header: "Action",
        id: "action",
        Cell: ({ cell: { row } }) => {
          return (
            <div className="relative isolate flex gap-4">
              <div className="flex gap-4">
                <Link
                  href={{
                    pathname:
                      AuthRouteConfig.USER_MANAGEMENT_ROLES_EDIT +
                      `/${row.original.id}`,
                    query: { name: row.original.name },
                  }}
                >
                  <ActionButton variant="info" onClick={() => null} />
                </Link>
                <ActionButton
                  variant="danger"
                  disabled={Number(row.original.employees) !== 0}
                  onClick={() => {
                    setEditData(row.original);
                    setOpenDelete(true);
                  }}
                />
              </div>
            </div>
          );
        },
      },
    ],
    [pageNumber, pageSize],
  );
  const deleteAction = () => {
    deleteRole({ name: editData?.name as string })
      .unwrap()
      .then(() => {
        notify.success({
          message: `Deleted Successfully`,
          subtitle: `You have successfully deleted ${editData?.name}`,
        });
        setOpenDelete(false);
      })
      .catch((err: IApiError) => {
        notify.error({
          message: "Deletion failed",
          subtitle: getErrorMessage(err),
        });
      });
  };
  return (
    <div>
      <ConfirmationModal
        isOpen={openDelete}
        closeModal={() => setOpenDelete(false)}
        handleClick={deleteAction}
        formTitle="Delete Role"
        message={
          <p>
            Are you sure you want to delete{" "}
            <span className="text-R400">{editData?.name}</span>? This action
            cannot be undone.
          </p>
        }
        isLoading={isLoading}
        type={"delete"}
        buttonLabel="Yes, Delete"
      />

      <div>
        <TMTable<IRolesProps>
          columns={columns}
          data={tableData?.items || []}
          title="Roles List"
          availablePages={tableData?.metaData?.totalPages}
          setPageNumber={setPageNumber}
          additionalTitleData={
            <div>
              <Search
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPageNumber(1);
                }}
              />
            </div>
          }
          loading={loading}
          metaData={tableData?.metaData}
        />
      </div>
    </div>
  );
};

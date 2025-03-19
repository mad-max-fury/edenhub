import React, { useState } from "react";
import Link from "next/link";
import {
  ActionButton,
  ConfirmationModal,
  ExtendedColumn,
  Modal,
  notify,
  Search,
  TMTable,
} from "@/components";
import { AuthRouteConfig } from "@/constants/routes";
import {
  IMenuProps,
  IPaginatedMenusResponse,
  useDeleteMenuMutation,
} from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";
import { ITableProps } from "@/redux/api/interface";
import { getErrorMessage } from "@/utils/getErrorMessges";

import { AddOrEditMenu } from "./AddOrEditMenu";

export const ManageMenuTable = ({
  tableData,
  setPageNumber,
  setSearchTerm,
  pageSize,
  pageNumber,
  loading,
  searchTerm,
}: ITableProps<IPaginatedMenusResponse>) => {
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [editData, setEditData] = useState<IMenuProps | null>(null);
  const [deleteMenu, { isLoading }] = useDeleteMenuMutation();
  const columns: ExtendedColumn<IMenuProps>[] = React.useMemo(
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
        Header: "Menu Name",
        accessor: "name",
      },
      {
        Header: "Claims",
        accessor: "claimCount",
        Cell: ({ cell: { row } }) => (
          <p className="text-B400">{row.original.claimCount}</p>
        ),
      },
      {
        Header: "Action",
        id: "action", // use id in place of accessor for column that does not exist in data interface
        Cell: ({ cell: { row } }) => (
          <div className="flex gap-4">
            <Link
              className="duration-600 flex h-[40px] w-fit items-center justify-center rounded-[4px] px-3 text-B400 transition-all ease-in-out hover:bg-B50 disabled:bg-N0 disabled:text-N50"
              href={{
                pathname: `${AuthRouteConfig.USER_MANAGEMENT_MANAGE_MENU}/${row?.original.id}`,
                query: { name: row.original.name },
              }}
            >
              Manage Claims
            </Link>
            <ActionButton
              variant="info"
              onClick={() => {
                setEditData(row.original);
                setOpen(true);
              }}
            />
            <ActionButton
              variant="danger"
              disabled={row.original.claimCount > 0}
              onClick={() => {
                setEditData(row.original);
                setOpenDelete(true);
              }}
            />
          </div>
        ),
      },
    ],
    [pageNumber, pageSize],
  );
  const deleteAction = () => {
    deleteMenu(editData?.id as string)
      .unwrap()
      .then(() => {
        notify.success({
          message: `Deleted Successfully`,
          subtitle: `You have successfully deleted  ${editData?.name}`,
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
      <Modal
        isOpen={open}
        closeModal={() => setOpen(false)}
        title="Edit Menu"
        mobileLayoutType="full"
      >
        <AddOrEditMenu
          closeModal={() => setOpen(false)}
          editData={editData ?? null}
        />
      </Modal>
      <ConfirmationModal
        isOpen={openDelete}
        closeModal={() => setOpenDelete(false)}
        handleClick={deleteAction}
        formTitle="Delete Menu"
        message={
          <p>
            Are you sure you want to delete{" "}
            <span className="text-R400">{editData?.name}</span> this action
            cannot be undone
          </p>
        }
        isLoading={isLoading}
        type={"delete"}
        buttonLabel="Yes, Delete"
      />
      <TMTable<IMenuProps>
        columns={columns}
        data={tableData?.items || []}
        title="Menu List"
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
  );
};

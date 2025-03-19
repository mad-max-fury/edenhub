import React, { useState } from "react";
import {
  ActionButton,
  ConfirmationModal,
  ExtendedColumn,
  Modal,
  notify,
  Search,
  TMTable,
} from "@/components";
import {
  IJobDesignationProps,
  IPaginatedJobDeignationsResponse,
  useDeleteJobDesignationMutation,
} from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";
import { ITableProps } from "@/redux/api/interface";
import { getErrorMessage } from "@/utils/getErrorMessges";

import { AddOrEditJobDesignations } from "./AddOrEditJobDesignations";

export const Table = ({
  tableData,
  setPageNumber,
  setSearchTerm,
  pageSize,
  pageNumber,
  loading,
  searchTerm,
}: ITableProps<IPaginatedJobDeignationsResponse>) => {
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [editData, setEditData] = useState<IJobDesignationProps | null>(null);
  const [deleteJobDesignation, { isLoading }] =
    useDeleteJobDesignationMutation();

  const columns: ExtendedColumn<IJobDesignationProps>[] = React.useMemo(
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
        Header: "Designation Name",
        accessor: "name",
      },
      {
        Header: "Leave Days",
        accessor: "leaveDays",
        Cell: ({ cell: { row } }) => (
          <p className="text-B400">{row.original.leaveDays}</p>
        ),
      },
      {
        Header: "Staff",
        accessor: "employees",
        Cell: ({ cell: { row } }) => (
          <p className="text-B400">{row.original.employees}</p>
        ),
      },
      {
        Header: "Action",
        id: "action", // use id in place of accessor for column that does not exist in data interface
        Cell: ({ cell: { row } }) => (
          <div className="flex gap-4">
            <ActionButton
              variant="info"
              onClick={() => {
                setEditData(row.original);
                setOpen(true);
              }}
            />
            <ActionButton
              variant="danger"
              disabled={row.original.employees > 0}
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
    deleteJobDesignation(editData?.id as string)
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
        title="Edit Job Designation"
        mobileLayoutType="full"
      >
        <AddOrEditJobDesignations
          closeModal={() => setOpen(false)}
          editData={editData ?? null}
        />
      </Modal>
      <ConfirmationModal
        isOpen={openDelete}
        closeModal={() => setOpenDelete(false)}
        handleClick={deleteAction}
        formTitle="Delete Job Designation"
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
      <TMTable<IJobDesignationProps>
        columns={columns}
        data={tableData?.items || []}
        title="Designation List"
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

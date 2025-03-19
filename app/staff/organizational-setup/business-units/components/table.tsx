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
  IBusinessUnitProps,
  IPaginatedBusinessUnitResponse,
  useDeleteBusinessUnitMutation,
} from "@/redux/api/businessUnit";
import { IApiError } from "@/redux/api/genericInterface";
import {
  ISelectItemPropsWithValueGeneric,
  ITableProps,
} from "@/redux/api/interface";
import { getErrorMessage } from "@/utils/getErrorMessges";

import { AddOrEditBusinesses } from "./AddOrEditBusinesses";

interface IDepartmentsTableProps
  extends ITableProps<IPaginatedBusinessUnitResponse> {
  allCompanies: ISelectItemPropsWithValueGeneric[];
  allDepartments: ISelectItemPropsWithValueGeneric[];
}
export const Table = ({
  tableData,
  setPageNumber,
  setSearchTerm,
  pageSize,
  pageNumber,
  loading,
  searchTerm,
  allCompanies,
  allDepartments,
}: IDepartmentsTableProps) => {
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [editData, setEditData] = useState<IBusinessUnitProps | null>(null);
  const [deleteBusinessUnit, { isLoading }] = useDeleteBusinessUnitMutation();
  const columns: ExtendedColumn<IBusinessUnitProps>[] = React.useMemo(
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
        Header: "Description",
        accessor: "description",
      },
      {
        Header: "Company",
        accessor: "company",
      },
      {
        Header: "Departments",
        accessor: "departments",
        Cell: ({ cell: { row } }) => (
          <p className="text-B400">{row.original.departments.length}</p>
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
              disabled={row.original.departments.length > 0}
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
    deleteBusinessUnit(editData?.id as string)
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
        title="Edit Business Unit"
        mobileLayoutType="full"
      >
        <AddOrEditBusinesses
          closeModal={() => setOpen(false)}
          editData={editData ?? null}
          allCompanies={allCompanies}
          allDepartments={allDepartments}
        />
      </Modal>
      <ConfirmationModal
        isOpen={openDelete}
        closeModal={() => setOpenDelete(false)}
        handleClick={deleteAction}
        formTitle="Delete Business Unit"
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
      <TMTable<IBusinessUnitProps>
        columns={columns}
        data={tableData?.items || []}
        title="Business Units"
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

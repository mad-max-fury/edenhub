import React, { useState } from "react";
import {
  ActionButton,
  ConfirmationModal,
  ExtendedColumn,
  notify,
  Search,
  TMTable,
} from "@/components";
import {
  IMenuClaimProp,
  IPaginatedMenuClaimsResponse,
  useDeleteMenuClaimMutation,
} from "@/redux/api";
import { IApiError } from "@/redux/api/genericInterface";
import { ITableProps } from "@/redux/api/interface";
import { getErrorMessage } from "@/utils/getErrorMessges";

interface IProps extends ITableProps<IPaginatedMenuClaimsResponse> {
  menuId: string;
  menu: string;
}
export const ManageMenuClaimsTable = ({
  tableData,
  setPageNumber,
  setSearchTerm,
  pageSize,
  pageNumber,
  loading,
  searchTerm,
  menuId,
  menu,
}: IProps) => {
  const [openDelete, setOpenDelete] = useState(false);
  const [editData, setEditData] = useState<IMenuClaimProp | null>(null);
  const [deleteClaim, { isLoading }] = useDeleteMenuClaimMutation();
  const columns: ExtendedColumn<IMenuClaimProp>[] = React.useMemo(
    () => [
      {
        Header: "S/N",
        sticky: "left",
        Cell: ({ cell: { row } }) => (
          <div>
            <span>{pageSize * (pageNumber - 1) + (row.index + 1)}</span>
          </div>
        ),
      },
      {
        Header: "Claim Name",
        accessor: "name",
      },
      {
        Header: "Action",
        id: "action", // use id in place of accessor for column that does not exist in data interface
        Cell: ({ cell: { row } }) => (
          <div className="flex gap-4">
            <ActionButton
              variant="danger"
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
    deleteClaim({
      menuId,
      claim: String(editData?.name),
    })
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
      <ConfirmationModal
        isOpen={openDelete}
        closeModal={() => setOpenDelete(false)}
        handleClick={deleteAction}
        formTitle="Delete claim"
        message={
          <p>
            Are you sure you want to remove{" "}
            <span className="text-R400">{editData?.name}</span> from {`${menu}`}
          </p>
        }
        isLoading={isLoading}
        type={"delete"}
        buttonLabel="Yes, Delete"
      />
      <TMTable<IMenuClaimProp>
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

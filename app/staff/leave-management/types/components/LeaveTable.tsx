import React, { useState } from "react";
import {
  ActionButton,
  ConfirmationModal,
  ExtendedColumn,
  Modal,
  notify,
  Search,
  Spinner,
  TMTable,
  ToggleElement,
} from "@/components";
import { IApiError } from "@/redux/api/genericInterface";
import { ITableProps } from "@/redux/api/interface";
import {
  ILeaveProps,
  IPaginatedLeaveTypesResponse,
  useDeleteLeaveTypeMutation,
  useToggleLeaveTypeMutation,
} from "@/redux/api/leave";
import { ISelectResponse } from "@/redux/api/select";
import { getErrorMessage } from "@/utils/getErrorMessges";

import { AddOrEditLeaveType } from "./addOrEditLeaveType";

type LeaveTableProps = ITableProps<IPaginatedLeaveTypesResponse> & {
  leaveDaysOptions: ISelectResponse[];
  leaveTypesId: ISelectResponse[];
};
export const LeaveTable = ({
  tableData,
  setPageNumber,
  setSearchTerm,
  pageSize,
  pageNumber,
  searchTerm,
  loading,
  leaveDaysOptions,
  leaveTypesId,
}: LeaveTableProps) => {
  const [deleteLeaveType, { isLoading }] = useDeleteLeaveTypeMutation();
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [editData, setEditData] = useState<ILeaveProps | null>(null);

  const columns: ExtendedColumn<ILeaveProps>[] = React.useMemo(
    () => [
      {
        Header: "S/N",
        sticky: "left",
        accessor: "leaveId",
        Cell: ({ cell: { row } }) => (
          <div>
            <span>{pageSize * (pageNumber - 1) + (row.index + 1)}</span>
          </div>
        ),
      },
      {
        Header: "Type of Leave",
        accessor: "name",
      },
      {
        Header: " No of Days",
        accessor: "numberOfDays",
        Cell: ({ cell: { row } }) => (
          <div className="w-[250px]">
            <span>{row.original?.numberOfDays}</span>
          </div>
        ),
      },
      {
        Header: "Public Holidays & Weekends",
        id: "pub",
        Cell: ({ cell: { row } }) => (
          <div className="">
            <span>{row.original?.requiredDocument ? "Yes" : "No"}</span>
          </div>
        ),
      },
      {
        Header: "Requires Document",
        accessor: "requiredDocument",
        Cell: ({ cell: { row } }) => (
          <div className="">
            <span>{row.original?.requiredDocument ? "Yes" : "No"}</span>
          </div>
        ),
      },
      {
        Header: "Document Name",
        accessor: "document",
        Cell: ({ cell: { row } }) => (
          <div className="w-[250px]">
            <span>{row.original?.document ?? "--"}</span>
          </div>
        ),
      },
      {
        Header: "Action",
        id: "action",
        Cell: ({ cell: { row } }) => {
          const [showToggleConfrimation, setShowToggleConfirmation] =
            useState(false);
          const [mutate, { isLoading }] = useToggleLeaveTypeMutation();

          const toggleAction = () => {
            mutate(`${editData?.leaveId}`)
              .unwrap()
              .then(() => {
                notify.success({
                  message: `Leave ${editData?.status ? "deactivated" : "activated"} successfully`,
                  subtitle: `You have successfully ${editData?.status ? "deactivated" : "activated"}  ${row?.original?.name}`,
                });
                setShowToggleConfirmation(false);
              })
              .catch((error) => {
                notify.error({
                  message: `Failed to ${row.original.status ? "deactivate" : "activate"} leave `,
                  subtitle: getErrorMessage(error as IApiError),
                });
              });
          };
          return (
            <div className="flex items-center gap-4">
              <ActionButton
                variant="info"
                onClick={() => {
                  setEditData(row?.original);
                  setOpenEdit(true);
                }}
              />

              <ActionButton
                variant="danger"
                onClick={() => {
                  setEditData(row?.original);
                  setOpenDelete(true);
                }}
              />
              <div>
                {isLoading ? (
                  <div className="relative h-6 w-6 [&>div>div]:aspect-square [&>div>div]:h-full [&>div]:aspect-square [&>div]:h-full">
                    <Spinner />
                  </div>
                ) : (
                  <div
                    onClick={(e) => {
                      // e.stopPropagation();
                      setShowToggleConfirmation(true);
                      setEditData(row?.original);
                    }}
                  >
                    <ToggleElement
                      id={`${row?.original?.leaveId}`}
                      checked={row?.original?.status}
                    />
                  </div>
                )}
              </div>

              <ConfirmationModal
                isOpen={showToggleConfrimation}
                closeModal={() => setShowToggleConfirmation(false)}
                formTitle={`${!editData?.status ? "Activate" : "Deactivate"} Leave Type`}
                message={
                  <p>
                    Are you sure you want to{" "}
                    {!editData?.status ? "activate" : "deactivate"}{" "}
                    <b className="text-R400">{row?.original?.name}</b>
                  </p>
                }
                buttonLabel="Yes, toggle"
                type="confirm"
                handleClick={() => toggleAction()}
                isLoading={isLoading}
              />
            </div>
          );
        },
      },
    ],
    [pageNumber, pageSize],
  );

  const deleteAction = () => {
    if (!editData) {
      return notify.success({
        message: "Leave ID is required",
        subtitle: "Please trigger deletion again",
      });
    }
    deleteLeaveType(`${editData?.leaveId}`)
      .unwrap()
      .then(() => {
        notify.success({
          message: "Leave deleted successfully",
          subtitle: `You have successfully deleted  ${editData?.name}`,
        });
        setOpenDelete(false);
        setEditData(null);
      })
      .catch((error) => {
        notify.error({
          message: "Failed to delete leave type",
          subtitle: getErrorMessage(error as IApiError),
        });
      });
  };

  return (
    <>
      <ConfirmationModal
        isOpen={openDelete}
        closeModal={() => setOpenDelete(false)}
        formTitle="Delete Leave Type"
        message={
          <p>
            Are you sure you want to delete{" "}
            <span className="text-R400">{editData?.name}</span> this action
            cannot be undone
          </p>
        }
        buttonLabel="Yes, Delete"
        type="delete"
        handleClick={() => deleteAction()}
        isLoading={isLoading}
      />
      <TMTable<ILeaveProps>
        columns={columns}
        data={tableData?.items || []}
        title="List"
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
      <Modal
        isOpen={openEdit}
        closeModal={() => setOpenEdit(false)}
        title="Edit Leave Type"
        mobileLayoutType="full"
      >
        <AddOrEditLeaveType
          editData={editData}
          leaveDaysOptions={leaveDaysOptions}
          leaveTypesId={leaveTypesId}
          closeModal={() => setOpenEdit(false)}
        />
      </Modal>
    </>
  );
};

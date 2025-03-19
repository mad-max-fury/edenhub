import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
  IDocumentTemplateProps,
  IPaginatedDocumntTemplateResponse,
  useDeleteDocumentTemplateMutation,
} from "@/redux/api/documentTemplate";
import { setDocumentTemplateForm } from "@/redux/api/documentTemplate/document.slice";
import { IApiError } from "@/redux/api/genericInterface";
import { ITableProps } from "@/redux/api/interface";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { useDispatch } from "react-redux";

export const DocumentTemplateTable = ({
  tableData,
  setPageNumber,
  setSearchTerm,
  pageSize,
  pageNumber,
  searchTerm,
  loading,
}: ITableProps<IPaginatedDocumntTemplateResponse>) => {
  const [deleteTemplate, { isLoading }] = useDeleteDocumentTemplateMutation();
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [editData, setEditData] = useState<IDocumentTemplateProps | null>(null);
  const columns: ExtendedColumn<IDocumentTemplateProps>[] = React.useMemo(
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
        Header: "Template Name",
        accessor: "name",
      },
      {
        Header: " Description",
        accessor: "description",
      },
      {
        Header: "Category",
        accessor: "documentCategory",
      },
      {
        Header: "Action",
        id: "action",
        Cell: ({ cell: { row } }) => {
          const dispatch = useDispatch();
          const { push } = useRouter();
          return (
            <div className="flex gap-4">
              <ActionButton
                variant="info"
                onClick={() => {
                  dispatch(setDocumentTemplateForm(row.original));
                  push(AuthRouteConfig.EMPLOYEE_MANAGEMENT_DOCUMENT_CREATE);
                }}
              />

              <ActionButton
                variant="danger"
                onClick={() => {
                  setEditData(row.original);
                  setOpenDelete(true);
                }}
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
        message: "Document ID is required",
        subtitle: "Please trigger deletion again",
      });
    }
    deleteTemplate(editData.id.toString())
      .unwrap()
      .then(() => {
        notify.success({
          message: "Document Template deleted successfully",
          subtitle: `You have successfully deleted  ${editData?.name}`,
        });
        setOpenDelete(false);
        setEditData(null);
      })
      .catch((error) => {
        notify.error({
          message: "Failed to delete document template",
          subtitle: getErrorMessage(error as IApiError),
        });
      });
  };

  return (
    <>
      <ConfirmationModal
        isOpen={openDelete}
        closeModal={() => setOpenDelete(false)}
        formTitle="Delete Document Template"
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
      <TMTable<IDocumentTemplateProps>
        columns={columns}
        data={tableData?.items || []}
        title="Document List"
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
    </>
  );
};

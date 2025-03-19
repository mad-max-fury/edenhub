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
import { IApiError } from "@/redux/api/genericInterface";
import {
  ISelectItemPropsWithValueGeneric,
  ITableProps,
} from "@/redux/api/interface";
import {
  ILocationProps,
  IPaginatedLocationsResponse,
  useDeleteLocationMutation,
} from "@/redux/api/location";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { truncateString } from "@/utils/helpers";

import { AddOrEditLocation } from "./AddOrEditLocations";

interface ILocationsTableProps
  extends ITableProps<IPaginatedLocationsResponse> {
  allCountries: ISelectItemPropsWithValueGeneric[];
  allCompanies: ISelectItemPropsWithValueGeneric[];
}
export const LocationsTable = ({
  tableData,
  setPageNumber,
  setSearchTerm,
  pageSize,
  pageNumber,
  loading,
  searchTerm,
  allCountries,
  allCompanies,
}: ILocationsTableProps) => {
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [editData, setEditData] = useState<ILocationProps | null>(null);
  const [deleteLocation, { isLoading }] = useDeleteLocationMutation();

  const columns: ExtendedColumn<ILocationProps>[] = React.useMemo(
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
        Header: "Location Name",
        accessor: "name",
      },
      {
        Header: "Location Code",
        accessor: "code",
      },
      {
        Header: "Company",
        accessor: "companies",
        Cell: ({ cell: { row } }) => {
          const companies = row.original.companies?.map(
            (company) => company?.name,
          );

          let displayCompanies;
          if (companies.length > 3) {
            displayCompanies = `${companies.slice(0, 3).join(", ")} + ${companies.length - 3} more`;
          } else {
            displayCompanies = companies.join(", ");
          }

          return <span>{displayCompanies}</span>;
        },
      },
      {
        Header: "Staff",
        accessor: "staff",
        Cell: ({ cell: { row } }) => (
          <p className="text-B400">{row.original.staff}</p>
        ),
      },
      {
        Header: "Address",
        accessor: "address",
        Cell: ({ cell: { row } }) => {
          return (
            <span>{truncateString(row.original.address ?? "None", 27)}</span>
          );
        },
      },
      {
        Header: "Action",
        id: "action",
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
              disabled={Number(row.original.staff) !== 0}
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
    deleteLocation(editData?.id as string)
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
        title="Edit Lcation"
        mobileLayoutType="full"
      >
        <AddOrEditLocation
          closeModal={() => setOpen(false)}
          editData={editData ?? null}
          allCountries={allCountries}
          allCompanies={allCompanies}
        />
      </Modal>
      <ConfirmationModal
        isOpen={openDelete}
        closeModal={() => setOpenDelete(false)}
        handleClick={deleteAction}
        formTitle="Delete Location"
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
      <TMTable<ILocationProps>
        columns={columns}
        data={tableData?.items || []}
        title="Location List"
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

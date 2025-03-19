import React, { useState } from "react";
import {
  Avatar,
  ButtonDropdown,
  ButtonDropdownItem,
  ExtendedColumn,
  Modal,
  TMTable,
} from "@/components";
import { IPaginatedUsersResponse, IUserProps } from "@/redux/api";
import {
  ISelectItemPropsWithValueGeneric,
  ITableProps,
} from "@/redux/api/interface";

import useMediaQuery from "@/hooks/useMediaQuery";

import { AssignClaim } from "./AssignClaim";
import { AssignRole } from "./AssignRole";
import { AssignStaffID } from "./AssignStaffID";

interface IUsersTableProps
  extends Omit<
    ITableProps<IPaginatedUsersResponse | undefined>,
    "setSearchTerm" | "searchTerm" | "pageSize" | "pageNumber"
  > {
  allRoles: ISelectItemPropsWithValueGeneric[];
}

export const UsersTable = ({
  tableData,
  setPageNumber,
  loading,
  allRoles,
}: IUsersTableProps) => {
  const [openAssignRole, setOpenAssignRole] = useState(false);
  const [openAssignClaim, setOpenAssignClaim] = useState(false);
  const [openAssignIDCard, setOpenAssignIDCard] = useState(false);
  const [editData, setEditData] = useState<IUserProps | null>(null);

  const isDesktop = useMediaQuery("(min-width: 1025px)");

  const columns: ExtendedColumn<IUserProps>[] = React.useMemo(
    () => [
      {
        Header: "Full Name",
        Cell: ({ cell: { row } }) => {
          const fullName = `${row.original.firstname} ${row.original.lastname} ${typeof row.original?.middlename === "string" ? row.original.middlename : ""}`;
          return (
            <div className="flex w-fit items-center gap-2">
              <Avatar
                fullname={fullName}
                src={row.original.profilePicture}
                size="sm"
              />
              <div className="flex flex-col">
                <span className="font-medium text-N900">{fullName}</span>
                <span className="text-xs text-N100">{row.original.email}</span>
              </div>
            </div>
          );
        },
      },
      {
        sticky: isDesktop ? "left" : undefined,
        Header: "Staff ID",
        accessor: "staffId",
        Cell: ({ cell: { row } }) => <p>{row.original.staffId ?? "--"}</p>,
      },
      {
        Header: "Company",
        accessor: "company",
        Cell: ({ cell: { row } }) => <p>{row.original.company ?? "--"}</p>,
      },

      {
        Header: "Department",
        accessor: "department",
        Cell: ({ cell: { row } }) => <p>{row.original.department ?? "--"}</p>,
      },
      {
        Header: "Role",
        accessor: "role",
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
        id: "action",
        Cell: ({ cell: { row } }) => {
          const buttonGroup: ButtonDropdownItem[] = [
            {
              name: "View Profile",
              onClick: () => {},
            },
            {
              name: "Assign Role",
              onClick: () => {
                setEditData(row.original);
                setOpenAssignRole(true);
              },
            },
            {
              name: "Assign Claim",
              onClick: () => {
                setEditData(row.original);
                setOpenAssignClaim(true);
              },
            },
            {
              name: "Assign Staff ID",
              onClick: () => {
                setEditData(row.original);
                setOpenAssignIDCard(true);
              },
            },
          ];

          return (
            <div className="relative isolate flex gap-4">
              <ButtonDropdown buttonGroup={buttonGroup} />
            </div>
          );
        },
      },
    ],
    [isDesktop],
  );

  return (
    <div>
      <Modal
        isOpen={openAssignRole}
        closeModal={() => setOpenAssignRole(false)}
        title="Assign Role"
        mobileLayoutType="full"
      >
        <AssignRole
          closeModal={() => setOpenAssignRole(false)}
          editData={editData ?? null}
          allRoles={allRoles}
        />
      </Modal>
      <Modal
        isOpen={openAssignIDCard}
        closeModal={() => setOpenAssignIDCard(false)}
        title="Assign Staff ID"
        mobileLayoutType="full"
      >
        <AssignStaffID
          closeModal={() => setOpenAssignIDCard(false)}
          editData={editData ?? null}
        />
      </Modal>
      <Modal
        isOpen={openAssignClaim}
        closeModal={() => setOpenAssignClaim(false)}
        title="Assign Claim"
        mobileLayoutType="full"
      >
        <AssignClaim
          closeModal={() => setOpenAssignClaim(false)}
          editData={editData ?? null}
        />
      </Modal>

      <div>
        <TMTable<IUserProps>
          columns={columns}
          data={tableData?.items || []}
          title="Users"
          availablePages={Number(tableData?.metaData?.totalPages)}
          setPageNumber={setPageNumber}
          loading={loading}
          metaData={tableData?.metaData}
        />
      </div>
    </div>
  );
};

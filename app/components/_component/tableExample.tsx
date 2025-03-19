"use client";

import React, { useState } from "react";
import { Button, ExtendedColumn, TMTable } from "@/components";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const UserTable: React.FC = () => {
  const [data] = useState<User[]>([
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Editor" },
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Editor" },
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Editor" },
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Editor" },
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Editor" },
  ]);

  const columns: ExtendedColumn<User>[] = React.useMemo(
    () => [
      {
        Header: "ID",
        sticky: "left",
        accessor: "id",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Role",
        accessor: "role",
      },
    ],
    [],
  );

  const [pageNumber, setPageNumber] = useState(1);

  return (
    <TMTable<User>
      columns={columns}
      data={data}
      title="User List"
      availablePages={3}
      setPageNumber={setPageNumber}
      additionalTitleData={
        <div>
          <Button variant={"danger"}>This button</Button>
        </div>
      }
      loading={false}
      isServerSidePagination={false}
      metaData={{
        pageSize: 1,
        currentPage: pageNumber,
        totalCount: data.length,
        totalPages: 1,
        hasPrevious: false,
        hasNext: false,
      }}
      onRowClick={(row) => console.log("Clicked row:", row.original)}
    />
  );
};

export default UserTable;

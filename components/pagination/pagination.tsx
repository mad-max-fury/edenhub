"use client";

import React from "react";
import Pagination from "@atlaskit/pagination";

interface PaginationElementProps {
  setPageNumber?: (page: number) => void;
  noOfPages?: number;
  length?: number;
  limit?: number;
  isServerSidePagination?: boolean;
}

export const PaginationElement: React.FC<PaginationElementProps> = ({
  setPageNumber = () => {},
  noOfPages,
  length,
  limit,
  isServerSidePagination,
}) => {
  const pages = Array.from(
    { length: noOfPages || (length && limit ? Math.ceil(length / limit) : 0) },
    (_, index) => index + 1
  );

  if ((length && limit && length <= limit) || (noOfPages && noOfPages <= 1)) {
    return null;
  }

  return (
    <div
      className={`flex items-center justify-center [&_button[aria-current="page"]]:bg-BR400 [&_button[aria-current="page"]]:text-N0 [&_button[disabled]]:hidden`}
    >
      <Pagination
        pages={pages}
        onChange={(_, page) =>
          setPageNumber(isServerSidePagination ? page : page - 1)
        }
      />
    </div>
  );
};

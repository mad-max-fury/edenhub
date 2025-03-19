"use client";

import React, { useContext, useState } from "react";
import { Badge, ExtendedColumn, SMSelectDropDown, TMTable } from "@/components";
import { CURRENT_YEAR } from "@/constants/data";
import {
  IEmployeeYearlyResultProps,
  useGetEmployeeYearlyAppraisalResultsQuery,
} from "@/redux/api";
import {
  findValueAndLabel,
  formatDate,
  generateYearOptions,
} from "@/utils/helpers";
import { UserContext } from "@/layouts/appLayout";


const options = generateYearOptions(2021);

const Page = () => {
  const userData = useContext(UserContext);
  const employeeId = userData?.user?.employeeId ?? "";
  const [year, setYear] = useState(CURRENT_YEAR);
  const { data, isFetching } = useGetEmployeeYearlyAppraisalResultsQuery({
    year,
    employeeId: employeeId ?? "",
  });

  const getAppraisalStatusBadgeVariant = (status: boolean) => {
    switch (status) {
      case true:
        return { variant: "blue", text: "In progress" };
      default:
        return { variant: "green", text: "Completed" };
    }
  };

  const columns: ExtendedColumn<IEmployeeYearlyResultProps>[] = React.useMemo(
    () => [
      {
        Header: "Title",
        accessor: "appraisalName",
      },
      {
        Header: "Period in review",
        Cell: ({ cell: { row } }) => {
          return (
            <div className="flex items-center">
              {row.original?.periodInReview.from &&
                formatDate(row.original?.periodInReview.from)}{" "}
              -{" "}
              {row.original?.periodInReview.to &&
                formatDate(row.original?.periodInReview.to)}
            </div>
          );
        },
      },
      {
        Header: "Start and End Date",
        Cell: ({ cell: { row } }) => {
          return (
            <div className="flex items-center">
              {row.original?.duration.startDate &&
                formatDate(row.original?.duration.startDate)}{" "}
              -{" "}
              {row.original?.duration.stopDate &&
                formatDate(row.original?.duration.stopDate)}
            </div>
          );
        },
      },
      {
        Header: "Status",
        Cell: ({ cell: { row } }) => {
          return (
            <Badge
              variant={row.original.status ? "blue" : "green"}
              text={getAppraisalStatusBadgeVariant(row.original.status).text}
            />
          );
        },
      },
      {
        Header: "Score",
        accessor: "finalResult",
        Cell: ({ cell: { value } }) => (
          <div className="flex items-center">{value.toFixed(2) ?? "_"}</div>
        ),
      },
    ],
    [],
  );

  return (
    <div className="w-full">
      {/* {data?.data.result?.length < 1 ? (
        <div className="flex min-h-[380px] w-full items-center justify-center px-5">
          <EmptyPageState
            title="No Performance"
            text={`You currently have no performance history`}
          />
        </div>
      ) : ( */}
      <TMTable
        title="Performance"
        additionalTitleData={
          <div>
            <SMSelectDropDown
              options={options}
              defaultValue={findValueAndLabel(CURRENT_YEAR, options)}
              onChange={(value) => {
                setYear(value.value as number);
              }}
            />
          </div>
        }
        columns={columns}
        data={data?.data?.result || []}
        loading={isFetching}
      />
      {/* )} */}
    </div>
  );
};

export default Page;

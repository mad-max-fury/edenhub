import React from "react";
import {
  Avatar,
  EmptyPageState,
  ExtendedColumn,
  Jumbotron,
  TMTable,
  Typography,
} from "@/components";
import {
  IHODOrSupervisorResponse,
  useGetAppraiserOrHODQuery,
} from "@/redux/api";
import { cn } from "@/utils/helpers";

interface ISupervisorProps {
  reviewId: string;
  empId: string;
  year: number;
  title?: string;
}

const Supervisors = ({ reviewId, empId, year }: ISupervisorProps) => {
  const { data: hodOrAppraisewr, isFetching: isLoadingAppraiserOrHOD } =
    useGetAppraiserOrHODQuery(
      {
        reviewId,
        empId,
        whoami: "appraiser",
        year,
      },
      {
        skip: !(reviewId && empId),
      },
    );
  const columns: ExtendedColumn<IHODOrSupervisorResponse>[] = React.useMemo(
    () => [
      {
        Header: "Full Name",
        accessor: "name",
        Cell: ({ cell: { row } }) => {
          return (
            <div className="flex w-fit items-center gap-2">
              <Avatar
                fullname={row.original.fullName ?? row.original.name}
                size="sm"
                src={row.original.profilePicture}
              />
              <div className="flex flex-col">
                <span className="font-medium text-N900">
                  {row.original.fullName ?? row.original.name}
                </span>
                <span className="text-xs text-N100">{row.original.email}</span>
              </div>
            </div>
          );
        },
      },
      {
        Header: "Department",
        accessor: "department",
      },
    ],
    [],
  );
  return (
    <div className={cn("ml-auto max-w-[935px] pb-6")}>
      <Jumbotron
        headerContainer={
          <div className="flex justify-between">
            <Typography variant="h-m" color="text-default">
              Supervisors
            </Typography>
          </div>
        }
      >
        <div className={cn("w-full")}>
          {hodOrAppraisewr?.data && hodOrAppraisewr?.data.length < 1 ? (
            <div className="flex min-h-[380px] w-full items-center justify-center px-5">
              <EmptyPageState
                title="No Supervisors"
                text={`This employee has no supervisor or hasn’t uploaded his/her EPA`}
              />
            </div>
          ) : (
            <TMTable
              columns={columns}
              data={hodOrAppraisewr?.data ?? []}
              className="border-0"
              loading={isLoadingAppraiserOrHOD}
            />
          )}
        </div>
      </Jumbotron>
    </div>
  );
};

export { Supervisors };

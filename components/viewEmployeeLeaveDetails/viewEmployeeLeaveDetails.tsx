import React from "react";
import { RowView, Spinner } from "@/components";

interface IleaveDetail {
  title: string;
  value: string | React.ReactNode;
}

interface IViewEmployeeLeaveProps {
  data: IleaveDetail[];
  loading: boolean;
}

export const ViewEmployeeLeaveDetails = ({
  data,
  loading,
}: IViewEmployeeLeaveProps) => {
  return loading ? (
    <div className="flex h-[300px] w-full items-center justify-center p-10">
      <Spinner />
    </div>
  ) : (
    <div className="flex flex-col gap-4 px-6 py-6">
      {data?.map((item, index) => (
        <div key={index}>
          <RowView name={item.title} value={item.value} align="start" />
        </div>
      ))}
    </div>
  );
};

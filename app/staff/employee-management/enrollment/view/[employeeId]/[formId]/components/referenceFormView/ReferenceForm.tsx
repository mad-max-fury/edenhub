"use client";

import React from "react";
import {
  Checkbox,
  DocumentViewer,
  PdfViewer,
  Jumbotron,
  RowView,
  TextField,
} from "@/components";
import { IGetEmployeeEnrollmentRes } from "@/redux/api";

type Props = {
  idCardData: unknown;
  employeeData: IGetEmployeeEnrollmentRes;
};

const ReferenceFormView = ({ idCardData, employeeData }: Props) => {
  const idData = idCardData as { referenceForm: string };
  return (
    <div className="ml-auto w-full max-w-[744px] pb-6">
      <Jumbotron headerText="Reference Form">
        <div className="flex flex-col gap-[18px] p-[23px]">
          <RowView
            name={"Form"}
            value={
              <PdfViewer
                name="Reference Form.pdf"
                link={idData?.referenceForm}
              />
            }
          />{" "}
        </div>
      </Jumbotron>
    </div>
  );
};

export default ReferenceFormView;

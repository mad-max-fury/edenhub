"use client";

import React from "react";
import { DocumentViewer, Jumbotron, PdfViewer, RowView } from "@/components";
import { GuarantorForm, Props } from "@/redux/api";

const GuarantorFormView = ({ idCardData, employeeData }: Props) => {
  const idData = idCardData as GuarantorForm;
  return (
    <div className="ml-auto w-full max-w-[744px] pb-6">
      <Jumbotron headerText="Guarantor’s Form">
        <div className="flex flex-col gap-[18px] p-[23px]">
          <RowView
            name={"Form 1"}
            value={
              <PdfViewer
                name="Guarantor Form.pdf"
                link={idData.employeeGuarantorForm[1].guarantorForm}
              />
            }
          />{" "}
          <RowView
            name={"Form 2"}
            value={
              <PdfViewer
                name="Guarantor Form.pdf"
                link={idData.employeeGuarantorForm[0].guarantorForm}
              />
            }
          />{" "}
        </div>
      </Jumbotron>
    </div>
  );
};

export default GuarantorFormView;

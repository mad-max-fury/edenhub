"use client";

import React, { useState } from "react";
import {
  Checkbox,
  DocumentViewer,
  Jumbotron,
  RowView,
  TextField,
  Typography,
} from "@/components";
import { IGetEmployeeEnrollmentRes } from "@/redux/api";
import { Assestation } from "@/redux/api/interface";
import { formatDate } from "@/utils/helpers";
import useGetDocumentTemplate from "@/utils/useGetDocumentTemplate";

type Props = {
  idCardData: unknown;
  employeeData: IGetEmployeeEnrollmentRes;
};

const AttestionView = ({ idCardData, employeeData }: Props) => {
  const [currentId, setCurrentId] = useState("");
  const idData = idCardData as { completed: boolean };

  const { downloadDocumentTemplate, isLoading: isDownloading } =
    useGetDocumentTemplate();
  return (
    <div className="ml-auto w-full max-w-[744px] pb-6">
      <Jumbotron headerText="Employee Attestation on code of conduct">
        <div className="flex flex-col gap-[18px] p-[23px]">
          <div className="flex flex-col gap-8 border-b border-N40 pb-9">
            <RowView
              name="Code of Conduct"
              value={
                <DocumentViewer
                  name="Code of Conduct.pdf"
                  link="https://www.google.com"
                  customButton={
                    <Typography
                      variant="p-m"
                      fontWeight="medium"
                      color="B400"
                      className="cursor-pointer"
                      onClick={() => {
                        setCurrentId(String(Assestation.CODE_OF_CONDUCT));
                        downloadDocumentTemplate(
                          String(Assestation.CODE_OF_CONDUCT),
                        );
                      }}
                    >
                      {isDownloading &&
                      currentId == String(Assestation.CODE_OF_CONDUCT)
                        ? "Downloading..."
                        : "Download"}
                    </Typography>
                  }
                />
              }
            />

            <RowView
              name="Employee Handbook"
              value={
                <DocumentViewer
                  name="Employee Handbook.pdf"
                  link="https://www.google.com"
                  customButton={
                    <Typography
                      variant="p-m"
                      fontWeight="medium"
                      color="B400"
                      className="cursor-pointer"
                      onClick={() => {
                        setCurrentId(String(Assestation.EMPLOYEE_HANDBOOK));
                        downloadDocumentTemplate(
                          String(Assestation.EMPLOYEE_HANDBOOK),
                        );
                      }}
                    >
                      {isDownloading &&
                      currentId == String(Assestation.EMPLOYEE_HANDBOOK)
                        ? "Downloading..."
                        : "Download"}
                    </Typography>
                  }
                />
              }
            />
          </div>
          <div className="flex gap-2">
            <Checkbox checked={idData?.completed} disabled label=" " />
            <Typography variant="p-m" color="N700">
              {` I ${employeeData?.employeeBioData?.basicInformation?.fullname} accept and will abide by the Tenece Group code of conduct and confirm that I have read and understood the Employee Handbook.`}
            </Typography>
          </div>
          <RowView
            name={"Signature"}
            value={
              <TextField
                name="name"
                disabled
                value={
                  employeeData?.employeeBioData?.basicInformation?.fullname
                }
              />
            }
          />{" "}
          <RowView
            name={"Date Signed"}
            value={formatDate(
              employeeData?.employeeAttestationForm?.dateSubmitted,
            )}
          />
        </div>
      </Jumbotron>
    </div>
  );
};

export default AttestionView;

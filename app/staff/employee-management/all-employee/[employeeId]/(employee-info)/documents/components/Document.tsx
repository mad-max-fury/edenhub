import React from "react";
import { DownloadIconTwo, FileIcon } from "@/assets/svgs";
import { DocumentViewer, Typography } from "@/components";

type Doc = {
  name: string;
  url: string;
};

export interface IDocument {
  name: string;
  documents: Doc[];
}

const EmployeeDocument = ({ document }: { document: Doc }) => {
  return (
    <DocumentViewer
      customButton={
        <div className="bg flex h-[40px] w-full items-center justify-between rounded-lg border border-N40 p-2">
          <div className="flex items-center gap-2">
            <span>
              <FileIcon />
            </span>
            <Typography className="capitalize" variant="p-m" color={"N500"}>
              {document.name}
            </Typography>
          </div>
          <DownloadIconTwo />{" "}
        </div>
      }
      name={document?.name}
      link={document.url}
      triggerType="button"
    />
  );
};

export { EmployeeDocument };

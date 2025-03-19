import React from "react";
import { Typography } from "@/components";

import { EmployeeDocument, IDocument } from "./Document";

const EmployeeDocumentRenderer = ({ document }: { document: IDocument }) => {
  return (
    <div className="flex w-full items-center gap-3">
      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full justify-between">
          <Typography variant="h-s" fontWeight={"bold"} color={"text-default"}>
            {document?.name}
          </Typography>
          {document?.documents?.length < 1 && (
            <Typography variant="p-m">No documents</Typography>
          )}
        </div>
        {document.documents?.length > 0 && (
          <div className="grid grid-cols-1 flex-col gap-2 md:grid-cols-2">
            {document.documents.map((doc) => (
              <EmployeeDocument key={doc.name} document={doc} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export { EmployeeDocumentRenderer };

import React from "react";
import { cn } from "@/utils/helpers";

import { Typography } from "../typography";

interface JumbotronProps {
  headerText?: string;
  endText?: string;
  headerContainer?: React.ReactNode;
  children: React.ReactNode;
  footerContent?: React.ReactNode;
  footerStyle?: string;
  borderClasses?: string;
}

function Jumbotron({
  headerText,
  endText,
  headerContainer,
  children,
  footerContent,
  footerStyle,
  borderClasses,
}: JumbotronProps) {
  return (
    <section
      className={cn(
        `w-full rounded-lg border border-solid border-N40 bg-white`,
        borderClasses,
      )}
    >
      {(headerText || headerContainer) && (
        <div className="border-b border-solid border-N40 p-4">
          {headerContainer ? (
            headerContainer
          ) : (
            <div className="flex justify-between">
              <Typography variant={"h-m"} color={"text-default"}>
                {headerText}
              </Typography>
              {endText && <h6 className="jumbo-header">{endText}</h6>}
            </div>
          )}
        </div>
      )}
      <div className="py-4">{children}</div>
      {footerContent && (
        <div
          className={cn(
            `flex justify-end border-t border-solid border-N40 p-4`,
            footerStyle,
          )}
        >
          {footerContent}
        </div>
      )}
    </section>
  );
}

export { Jumbotron };

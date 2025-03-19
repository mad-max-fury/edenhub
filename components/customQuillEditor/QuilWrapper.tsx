import React, { ReactNode } from "react";
import { cn } from "@/utils/helpers";

interface QuillWrapperProps {
  children: ReactNode;
  error?: boolean;
  className?: string;
}

export const QuillWrapper: React.FC<QuillWrapperProps> = ({
  children,
  error = false,
  className,
}) => {
  return (
    <div
      className={cn(
        "h-fit min-h-[300px] w-full border-t border-solid border-N40",
        "[&_.quill]:flex [&_.quill]:h-fit [&_.quill]:w-full [&_.quill]:flex-col",
        `[&_.quill]:!border-none`,
        "[&_.quill]:rounded-lg",

        // Toolbar styles
        "",
        `[&_.ql-toolbar]:border-b-solid [&_.ql-toolbar]:!border-x-0 [&_.ql-toolbar]:!border-b-[1px] [&_.ql-toolbar]:!border-t-0 [&_.ql-toolbar]:!border-b-N40`,

        // Container styles
        "[&_.ql-container]:flex-1 [&_.ql-container]:overflow-y-auto [&_.ql-container]:border-0",
        "[&_.ql-container]:!border-none [&_.ql-editor]:p-5",

        className,
      )}
    >
      {children}
    </div>
  );
};

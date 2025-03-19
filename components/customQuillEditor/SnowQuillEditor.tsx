import React from "react";
import dynamic from "next/dynamic";

import "react-quill/dist/quill.snow.css";

import { Typography } from "@/components";

import { QuillWrapper } from "./QuilWrapper";

// Import ReactQuill dynamically to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => (
    <div className="p-4 text-center">
      <Typography variant="p-m">Loading editor...</Typography>
    </div>
  ),
});

interface SnowQuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export const SnowQuillEditor: React.FC<SnowQuillEditorProps> = ({
  value,
  onChange,
  readOnly = false,
}) => {
  const modules = !readOnly
    ? {
        toolbar: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ font: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ script: "sub" }, { script: "super" }],
          [{ align: [] }],
          ["blockquote", "code-block"],
          ["clean"],
        ],
      }
    : undefined;

  const formats = [
    "header",
    "font",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "color",
    "background",
    "script",
    "align",
    "code-block",
    "link",
  ];

  return (
    <QuillWrapper>
      <ReactQuill
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        readOnly={readOnly}
        theme="snow"
        placeholder="Start writing your document content..."
      />
    </QuillWrapper>
  );
};

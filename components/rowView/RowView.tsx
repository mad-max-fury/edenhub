import { cn } from "@/utils/helpers";

import { Typography } from "../typography";

export const RowView = ({
  name,
  value,
  align = "center",
}: {
  name: string;
  value: string | React.ReactNode;
  align?: "start" | "end" | "center";
}) => {
  return (
    <div
      className={cn(
        "items-center gap-4 md:grid md:grid-cols-12",
        align === "start" && "items-start",
      )}
    >
      <div
        className={cn(
          "col-span-3 flex",
          align === "start"
            ? "mb-auto"
            : align === "center"
              ? "my-auto"
              : "mt-auto",
        )}
      >
        <Typography variant="h-s" fontWeight="medium">
          {name}
        </Typography>
      </div>
      <div className="col-span-9 grid grid-cols-1 gap-2">
        {typeof value === "string" ? (
          <Typography variant="h-s" color={"text-light"}>
            {value ?? "--"}
          </Typography>
        ) : (
          value
        )}
      </div>
    </div>
  );
};

"use client";

import { Typography } from "../typography";

interface IPageHeaderProps {
  title: string | React.ReactNode;
  buttonGroup?: React.ReactElement;
  subtitle?: string;
}

export const PageHeader: React.FC<IPageHeaderProps> = ({
  title,
  buttonGroup,
  subtitle,
}) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-col gap-1">
        {typeof title === "string" ? (
          <Typography variant="c-xxl" fontWeight="medium">
            {title}
          </Typography>
        ) : (
          title
        )}
        {subtitle && (
          <Typography variant="c-l" color="N900">
            {subtitle}
          </Typography>
        )}
      </div>
      <div>{buttonGroup}</div>
    </div>
  );
};

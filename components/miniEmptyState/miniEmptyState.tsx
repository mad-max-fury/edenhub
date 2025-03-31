"use client";

import Image from "next/image";
import { Typography } from "../typography";

interface IEmptyProps {
  imgSrc?: string;
  icon?: React.ReactNode;
  title?: string;
  text?: string;
  buttonGroup?: React.ReactElement;
}

export const MiniEmptyState: React.FC<IEmptyProps> = ({
  title,
  text,
  buttonGroup,
  imgSrc,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center ">
      {imgSrc ? (
        <Image
          src={imgSrc}
          alt={(title as string) || (text as string)}
          width={40}
          height={40}
        />
      ) : (
        <div>{icon}</div>
      )}
      {title && (
        <Typography
          className="mb-1"
          variant="c-l"
          color="N800"
          fontWeight={"medium"}
        >
          {title}
        </Typography>
      )}
      {text && (
        <Typography
          variant="p-m"
          color="N600"
          className="!max-w-[350px]  text-center"
        >
          {text}
        </Typography>
      )}
      {buttonGroup && <div className="mt-2">{buttonGroup}</div>}
    </div>
  );
};

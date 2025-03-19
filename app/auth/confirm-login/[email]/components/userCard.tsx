import Link from "next/link";
import { EditIcon } from "@/assets/svgs";
import { Avatar, Typography } from "@/components";
import { AuthRouteConfig } from "@/constants/routes";
import { IVerifyUserResponse } from "@/redux/api";
import { convertToCapitalized } from "@/utils/helpers";

export const UserCard = ({ data }: { data?: IVerifyUserResponse }) => {
  return (
    <div className="flex w-auto items-center gap-2">
      <Avatar
        size="md"
        fullname={convertToCapitalized(data?.fullName) ?? ""}
        src={data?.profilePicture}
      />
      <div>
        <Typography variant="c-xl" fontWeight="bold" className="mb-1">
          {convertToCapitalized(
            `${data?.fullName?.split(" ")[0]} ${data?.fullName?.split(" ")[1]}`,
          )}
        </Typography>
        <Typography variant="p-s" fontWeight="regular">
          {data?.email}
        </Typography>
      </div>
      <Link href={AuthRouteConfig.LOGIN}>
        <EditIcon />
      </Link>
    </div>
  );
};

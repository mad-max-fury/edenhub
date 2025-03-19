"use client";

import Image from "next/image";
import { NetworkImg } from "@/assets/images";
import { Button, notify, Typography } from "@/components";
import { IApiError } from "@/redux/api/genericInterface";
import { getErrorMessage } from "@/utils/getErrorMessges";

interface NetworkErrorProps {
  error: IApiError;
  refetch: () => void;
  isFetching: boolean;
}

const NetworkError = ({ error, refetch, isFetching }: NetworkErrorProps) => {
  const is403Error = error?.status === 403;
  

  const handleRetryClick = () => {
    refetch();
    if (error)
      notify.error({
        message: "Retry failed",
        subtitle: getErrorMessage(error),
      });
  };

  return (
    <>
      {is403Error ? (
        <section className="flex h-full w-full items-center justify-center">
          <div className="m-[auto] flex h-full w-full flex-col items-center justify-center mxxs:w-[80%]">
            <Typography variant="h-l" align="center" color="N300">
              Redirecting...
            </Typography>
          </div>
        </section>
      ) : (
        <section className="flex h-full w-full items-center justify-center">
          <div className="m-[auto] flex h-full w-full flex-col items-center justify-center mxxs:w-[80%]">
            <Image src={NetworkImg} alt="404 Image" width={250} height={250} />
            <Typography
              variant="h-xl"
              fontWeight="bold"
              align="center"
              className="mb-4 block text-[#0A0F2D]"
            >
              Oops! Something Went Wrong
            </Typography>
            <Typography
              variant="h-l"
              fontWeight="regular"
              align="center"
              className="mb-8 block text-[#2F3A4F] mmd:font-light mxxs:font-extralight"
            >
              {" "}
              Please try again later.
            </Typography>
            <Button
              variant={"primary"}
              loading={isFetching}
              disabled={isFetching}
              onClick={handleRetryClick}
            >
              Retry
            </Button>
          </div>
        </section>
      )}
    </>
  );
};

export { NetworkError };

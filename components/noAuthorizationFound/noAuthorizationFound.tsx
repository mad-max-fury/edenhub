"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { NoAuthFoundImg } from "@/assets/images";
import { Button, Typography } from "@/components";

export const NoAuthorizationFound = ({
  btnText,
  link,
}: {
  btnText?: string;
  link?: string;
}) => {
  const router = useRouter();

  return (
    <section className="flex h-screen w-screen items-center justify-center">
      <div className="absolute bottom-0 left-0 right-0 top-0 m-[auto] flex h-full w-full flex-col items-center justify-center">
        <Image src={NoAuthFoundImg} alt="401 Image" width={500} height={500} />
        <Typography
          variant="h-xl"
          fontWeight="bold"
          align="center"
          color="N800"
          className="mb-4 block"
        >
          No Authorization Found
        </Typography>
        <Typography
          variant="p-xl"
          fontWeight="regular"
          align="center"
          className="mb-8 block max-w-[34rem]"
        >
          You don&apos;t have permission to view this page. Please log in or
          reach out to your admin.
        </Typography>
        <div className="flex items-center justify-center gap-4">
          <Button variant={"secondary"}>Contact Support</Button>
          <Button
            variant={"primary"}
            onClick={() => (link ? router.push(link) : router.back())}
          >
            {btnText ?? "Go Back"}
          </Button>
        </div>
      </div>
    </section>
  );
};

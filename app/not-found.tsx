"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { NotFoundImg } from "@/assets/images";
import { Button, Typography } from "@/components";

const NotFound = () => {
  const router = useRouter();

  return (
    <section className="flex h-screen w-screen items-center justify-center">
      <div className="absolute bottom-0 left-0 right-0 top-0 m-[auto] flex h-full w-full flex-col items-center justify-center">
        <Image src={NotFoundImg} alt="404 Image" width={500} height={500} />
        <Typography
          variant="h-xl"
          fontWeight="bold"
          align="center"
          className="mb-4 block text-[#0A0F2D]"
        >
          Oops! Page Not Found
        </Typography>
        <Typography
          variant="h-l"
          fontWeight="regular"
          align="center"
          className="mb-8 block text-[#2F3A4F] mmd:font-light mxxs:font-extralight"
        >
          {" "}
          We&apos;re sorry, but the page you are looking for doesn&apos;t exist.
        </Typography>
        <Button variant={"primary"} onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    </section>
  );
};

export default NotFound;

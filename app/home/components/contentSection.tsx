"use client";

import React, { FC } from "react";
import Image, { StaticImageData } from "next/image";
import {
  RectLeft1,
  RectLeft2,
  RectLeft3,
  RectRight1,
  RectRight2,
  RectRight3,
} from "@/assets/images";
import { Typography } from "@/components";

interface IContentObject {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface IContentSectionData {
  title: string;
  description: string;
  contents: IContentObject[];
  image: StaticImageData;
}

interface IContentSectionProps {
  data: IContentSectionData;
}

const ContentSection: FC<IContentSectionProps> = ({ data }) => {
  const { title, description, contents, image } = data;

  return (
    <section className="relative">
      <div className="absolute -bottom-[25rem] left-0">
        <Image src={RectLeft1} alt="backgrounds" width={200} height={200} />
      </div>
      <div className="absolute -bottom-[35rem] left-0">
        <Image src={RectLeft2} alt="backgrounds" width={200} height={200} />
      </div>
      <div className="absolute -bottom-[28rem] left-[5rem]">
        <Image src={RectLeft3} alt="backgrounds" width={400} height={400} />
      </div>
      <div className="absolute right-0 top-[13rem]">
        <Image src={RectRight1} alt="backgrounds" width={400} height={400} />
      </div>
      <div className="absolute right-0 top-[30rem]">
        <Image src={RectRight2} alt="backgrounds" width={300} height={300} />
      </div>
      <div className="absolute bottom-4 right-0">
        <Image src={RectRight3} alt="backgrounds" width={100} height={100} />
      </div>

      <section className="px-[9.75rem] py-[5rem] mxl:px-[7rem] mlg:px-[5rem] msm:px-[1.5rem]">
        <div className="mx-auto max-w-screen-2xl">
          <div className="flex items-center justify-between mmlg:flex-col mmlg:items-start mmlg:gap-10">
            <div className="w-1/2 mmlg:w-full">
              <Typography
                color="text-default"
                variant="h-xxl"
                fontWeight="bold"
              >
                {title}
              </Typography>
              <Typography
                color="N300"
                variant="p-l"
                fontWeight="medium"
                className="mt-8 w-10/12"
              >
                {description}
              </Typography>
            </div>
            <div className="flex w-1/2 items-center justify-between gap-4 mmlg:w-full msm:flex-col msm:items-start msm:px-8">
              {contents.map((content, index) => (
                <div className="bg-transparent" key={index}>
                  {content.icon}
                  <Typography
                    color="N300"
                    variant="h-l"
                    fontWeight="bold"
                    className="mb-4 mt-8"
                  >
                    {content.title}
                  </Typography>
                  <Typography color="N70" variant="p-m" fontWeight="medium">
                    {content.description}
                  </Typography>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-[112px] flex items-center justify-center drop-shadow-2xl">
            <Image src={image} alt="Stock Image" width={1000} height={1000} />
          </div>
        </div>
      </section>
    </section>
  );
};

export default ContentSection;
